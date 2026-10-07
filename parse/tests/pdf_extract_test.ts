import { assertEquals, assertMatch } from "@std/assert";
import { extractPdfText } from "../src/pdf/extract.ts";

Deno.test("extracts text from PDF", async () => {
  const data = await Deno.readFile(
    new URL("../fixtures/example.pdf", import.meta.url),
  );

  const pages = await extractPdfText(data);

  assertEquals(pages.length > 0, true);
  assertEquals(pages[0].pageNumber, 1);
  assertMatch(pages[0].text, /KARTA CHARAKTERYSTYKI/i);
});

Deno.test("preserves page boundaries", async () => {
  const data = await Deno.readFile(
    new URL("../fixtures/example.pdf", import.meta.url),
  );

  const pages = await extractPdfText(data);

  assertEquals(
    pages.map((page) => page.pageNumber),
    pages.map((_, index) => index + 1),
  );
});
