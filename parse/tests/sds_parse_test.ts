import { assertEquals } from "@std/assert";
import { extractPdfText } from "../src/pdf/extract.ts";
import { parseSds } from "../src/sds/parse.ts";

Deno.test("parses SDS metadata", async () => {
  const data = await Deno.readFile(
    new URL("../fixtures/example.pdf", import.meta.url),
  );

  const pages = await extractPdfText(data);
  const sds = parseSds(pages);

  assertEquals(sds, {
    product: {
      name: "Reduktor NOx do silników wysokoprężnych z układem oczyszczan",
      code: "G  052910A2",
    },
    document: {
      issueDate: "2008-09-16",
      revisionDate: "2026-06-23",
      revision: "4.3",
    },
  });
});

function createPage(text: string, pageNumber = 1) {
  return { pageNumber, text, exactText: text };
}

function createFirstPage(extraLine = "") {
  return createPage(
    [
      "Nazwa handlowa: Example Product",
      "Kod produktu: ABC123",
      "Wersja: 4.3",
      "Data aktualizacji: 23.06.2026",
      "Data pierwszego wydania: 16.09.2020",
      extraLine,
    ].filter(Boolean).join("\n"),
  );
}

Deno.test("extracts UFI without a label", () => {
  const result = parseSds([
    createFirstPage("Product identifier: 1K80-S0U9-9008-YX05"),
  ]);

  assertEquals(result.product.ufi, "1K80-S0U9-9008-YX05");
});

Deno.test("normalizes UFI to uppercase", () => {
  const result = parseSds([
    createFirstPage("1k80-s0u9-9008-yx05"),
  ]);

  assertEquals(result.product.ufi, "1K80-S0U9-9008-YX05");
});

Deno.test("parses SDS without UFI", () => {
  const result = parseSds([createFirstPage()]);

  assertEquals(result.product.name, "Example Product");
  assertEquals("ufi" in result.product, false);
});

Deno.test("extracts UFI from a subsequent page", () => {
  const result = parseSds([
    createFirstPage(),
    createPage("Additional information: 1K80-S0U9-9008-YX05", 2),
  ]);

  assertEquals(result.product.ufi, "1K80-S0U9-9008-YX05");
});
