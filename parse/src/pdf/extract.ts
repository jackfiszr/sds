import * as pdfjsLib from "pdfjs-dist";

export interface PdfPageText {
  pageNumber: number;
  text: string;
  exactText: string;
}

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
