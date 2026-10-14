import type { PdfPageText } from "../pdf/extract.ts";

/** Product and document fields parsed from a Safety Data Sheet. */
export interface SdsData {
  /** Product identity fields. */
  product: {
    /** Commercial product name. */
    name: string;
    /** Product code, retaining its source spacing when available. */
    code: string;
    /** Unique Formula Identifier, if present. */
    ufi?: string;
  };
  /** SDS issue and revision metadata. */
  document: {
    /** Initial issue date in ISO `YYYY-MM-DD` format. */
    issueDate: string;
    /** Latest revision date in ISO `YYYY-MM-DD` format. */
    revisionDate: string;
    /** Document revision identifier. */
    revision: string;
  };
}

/** Field labels grouped by language. */
const labels = {
  name: [
    // Polski
    "Nazwa handlowa",
    "Nazwa produktu",
    // English
    "Trade name",
    "Product name",
    // Deutsch
    "Handelsname",
    "Produktname",
  ],
  code: [
    // Polski
    "Kod produktu",
    // English
    "Product code",
    // Deutsch
    "Produktnummer",
    "Produktcode",
  ],
  revision: [
    // Polski
    "Wersja",
    // English
    "Version",
    // Deutsch
    "Version",
  ],
  revisionDate: [
    // Polski
    "Aktualizacja",
    "Data aktualizacji",
    // English
    "Revision Date",
    "Revision date",
    // Deutsch
    "Überarbeitet am",
    "Überarbeitungsdatum",
  ],
  issueDate: [
    // Polski
    "Data pierwszego wydania",
    "Data wydania",
    // English
    "Date of first issue",
    "Issue date",
    // Deutsch
    "Datum der ersten Ausgabe",
    "Ausgabedatum",
  ],
};

/** Builds a regular-expression alternative from literal labels. */
function labelPattern(values: string[]): string {
  return values
    .toSorted((a, b) => b.length - a.length)
    .map(escapeRegExp)
    .join("|");
}

/** Matches any supported date format: DD.MM.YYYY or M/D/YYYY. */
const datePattern = String.raw`(\d{1,2}[./]\d{1,2}[./]\d{4})`;

/**
 * Parses product and revision metadata from the first page of an SDS.
 *
 * @param pages Text extracted from the SDS pages.
 * @returns Parsed product and document metadata.
 * @throws If the document has no pages or a required field is missing.
 */
export function parseSds(pages: PdfPageText[]): SdsData {
  if (pages.length === 0) {
    throw new Error("The SDS document contains no pages.");
  }

  const text = pages[0].text;
  const exactText = pages[0].exactText;

  const ufiMatch = pages
    .map((page) => page.text)
    .join("\n")
    .match(/\b([0-9AC-HJ-KM-NP-Y]{4}(?:-[0-9AC-HJ-KM-NP-Y]{4}){3})\b/i);

  const nameMatch = text.match(
    new RegExp(
      String.raw`(?:${labelPattern(labels.name)})\s*:\s*([\s\S]*?)(?=\n\s*(?:${
        labelPattern(labels.code)
      })\s*:)`,
      "i",
    ),
  );

  const codeMatch = text.match(
    new RegExp(
      String.raw`(?:${labelPattern(labels.code)})\s*:\s*([^\r\n]+)`,
      "i",
    ),
  );

  const revisionMatch = text.match(
    new RegExp(
      String.raw`(?:${labelPattern(labels.revision)})\s*:?\s+(\d+(?:\.\d+)+)`,
      "i",
    ),
  );

  const revisionDateMatch = text.match(
    new RegExp(
      String.raw`(?:${labelPattern(labels.revisionDate)})\s*:\s*${datePattern}`,
      "i",
    ),
  );

  const issueDateMatch = text.match(
    new RegExp(
      String.raw`(?:${labelPattern(labels.issueDate)})\s*:\s*${datePattern}`,
      "i",
    ),
  );

  if (!nameMatch) {
    throw new Error("Product trade name not found.");
  }

  if (!codeMatch) {
    throw new Error("Product code not found.");
  }

  if (!revisionMatch) {
    throw new Error("Document revision not found.");
  }

  if (!revisionDateMatch) {
    throw new Error("Document revision date not found.");
  }

  if (!issueDateMatch) {
    throw new Error("Initial issue date not found.");
  }

  const code = codeMatch[1].trim();

  return {
    product: {
      name: nameMatch[1].replace(/\s+/g, " ").trim(),
      code: findExactSpacing(exactText, code) ?? code,
      ...(ufiMatch ? { ufi: ufiMatch[1].toUpperCase() } : {}),
    },
    document: {
      issueDate: parseDate(issueDateMatch[1]),
      revisionDate: parseDate(revisionDateMatch[1]),
      revision: revisionMatch[1],
    },
  };
}

/** Converts a supported date format to ISO `YYYY-MM-DD`. */
function parseDate(value: string): string {
  const parts = value.split(/[./]/);
  const [first, second, year] = parts;

  // English dates may use M/D/YYYY; other formats use DD.MM.YYYY.
  if (value.includes("/")) {
    return `${year}-${second.padStart(2, "0")}-${first.padStart(2, "0")}`;
  }

  return `${year}-${second.padStart(2, "0")}-${first.padStart(2, "0")}`;
}

/**
 * Finds a value in extracted text while retaining its exact source spacing.
 *
 * @param exactText Page text reconstructed from PDF text operators.
 * @param value Whitespace-normalized text value to locate.
 * @returns The matching source text, or `undefined` if it cannot be located.
 */
function findExactSpacing(
  exactText: string,
  value: string,
): string | undefined {
  const parts = value.split(/\s+/).filter(Boolean);

  if (parts.length < 2) {
    return undefined;
  }

  const pattern = parts.map(escapeRegExp).join("\\s+");
  return exactText.match(new RegExp(pattern))?.[0];
}

/** Escapes regular-expression metacharacters in a literal string. */
function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
