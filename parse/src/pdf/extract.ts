import * as pdfjsLib from "pdfjs-dist";

/** Text extracted from a single page of a PDF document. */
export interface PdfPageText {
  /** One-based page number in the source document. */
  pageNumber: number;
  /** Page text in its normalized reading order. */
  text: string;
  /** Page text reconstructed from PDF text operators, preserving spacing. */
  exactText: string;
}

/**
 * Extracts page text from PDF data.
 *
 * @param data The complete PDF file as bytes.
 * @returns Extracted text and page metadata for each page.
 */
export async function extractPdfText(
  data: Uint8Array,
): Promise<PdfPageText[]> {
  const document = await pdfjsLib.getDocument({
    data,
    useSystemFonts: true,
  }).promise;

  const pages: PdfPageText[] = [];

  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber++) {
    const page = await document.getPage(pageNumber);
    const content = await page.getTextContent();

    const text = content.items
      .map((item) => "str" in item ? item.str + (item.hasEOL ? "\n" : "") : "")
      .join("");

    const operatorList = await page.getOperatorList();

    const exactText = operatorList.fnArray
      .map((fn, index) => {
        if (fn !== pdfjsLib.OPS.showText) {
          return "";
        }

        const items = operatorList.argsArray[index][0];

        return Array.isArray(items) ? extractOperatorText(items) : "";
      })
      .join("\n");

    pages.push({ pageNumber, text, exactText });
  }

  return pages;
}

/** Joins Unicode strings from PDF text-operator items. */
function extractOperatorText(items: unknown[]): string {
  return items
    .filter(
      (item): item is { unicode: string } =>
        typeof item === "object" &&
        item !== null &&
        "unicode" in item &&
        typeof item.unicode === "string",
    )
    .map((item) => item.unicode)
    .join("");
}
