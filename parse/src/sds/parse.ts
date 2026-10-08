import type { PdfPageText } from "../pdf/extract.ts";

/** Product and document fields parsed from a Safety Data Sheet. */
export interface SdsData {
  /** Product identity fields. */
  product: {
    /** Commercial product name. */
    name: string;
    /** Product code, retaining its source spacing when available. */
    code: string;
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

/**
 * Parses product and revision metadata from the first page of an SDS.
 *
 * @param pages Text extracted from the SDS pages.
 * @returns Parsed product and document metadata.
 * @throws If the document has no pages or a required field is missing.
 */
export function parseSds(pages: PdfPageText[]): SdsData {
  if (pages.length === 0) {
    throw new Error("Dokument SDS nie zawiera żadnych stron.");
  }

  const text = pages[0].text;
  const exactText = pages[0].exactText;

  const nameMatch = text.match(
    /Nazwa handlowa\s*:\s*([\s\S]*?)(?=\n\s*Kod produktu\s*:)/,
  );

  const codeMatch = text.match(
    /Kod produktu\s*:\s*([^\r\n]+)/,
  );

  const revisionMatch = text.match(
    /Wersja\s+(\d+(?:\.\d+)+)/,
  );

  const revisionDateMatch = text.match(
    /Aktualizacja\s*:\s*(\d{2}\.\d{2}\.\d{4})/,
  );

  const issueDateMatch = text.match(
    /Data pierwszego wydania\s*:\s*(\d{2}\.\d{2}\.\d{4})/,
  );

  if (!nameMatch) {
    throw new Error("Nie znaleziono nazwy handlowej produktu.");
  }

  if (!codeMatch) {
    throw new Error("Nie znaleziono kodu produktu.");
  }

  if (!revisionMatch) {
    throw new Error("Nie znaleziono wersji dokumentu.");
  }

  if (!revisionDateMatch) {
    throw new Error("Nie znaleziono daty aktualizacji dokumentu.");
  }

  if (!issueDateMatch) {
    throw new Error("Nie znaleziono daty pierwszego wydania dokumentu.");
  }

  const code = codeMatch[1].trim();

  return {
    product: {
      name: nameMatch[1].replace(/\s+/g, " ").trim(),
      code: findExactSpacing(exactText, code) ?? code,
    },
    document: {
      issueDate: parseDate(issueDateMatch[1]),
      revisionDate: parseDate(revisionDateMatch[1]),
      revision: revisionMatch[1],
    },
  };
}

/** Converts a dotted `DD.MM.YYYY` date to ISO `YYYY-MM-DD` format. */
function parseDate(value: string): string {
  const [day, month, year] = value.split(".");

  return `${year}-${month}-${day}`;
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
