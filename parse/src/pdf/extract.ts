import * as pdfjsLib from "pdfjs-dist";

export interface PdfPageText {
  pageNumber: number;
  text: string;
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

    pages.push({ pageNumber, text });
  }

  return pages;
}
