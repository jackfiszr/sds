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
