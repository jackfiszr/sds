import type { PdfPageText } from "../pdf/extract.ts";

export interface SdsData {
  product: {
    name: string;
    code: string;
  };
  document: {
    issueDate: string;
    revisionDate: string;
    revision: string;
  };
}

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

function parseDate(value: string): string {
  const [day, month, year] = value.split(".");

  return `${year}-${month}-${day}`;
}

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

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
