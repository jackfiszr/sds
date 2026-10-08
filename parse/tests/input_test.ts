import { assertEquals, assertRejects } from "@std/assert";
import { join } from "@std/path";
import { getPdfInputs } from "../src/input.ts";

Deno.test("finds PDF files in a directory", async () => {
  const directory = await Deno.makeTempDir();

  try {
    await Deno.writeTextFile(join(directory, "b.pdf"), "");
    await Deno.writeTextFile(join(directory, "a.PDF"), "");
    await Deno.writeTextFile(join(directory, "not-pdf.txt"), "");

    const files = await getPdfInputs(directory);

    assertEquals(files, [
      join(directory, "a.PDF"),
      join(directory, "b.pdf"),
    ]);
  } finally {
    await Deno.remove(directory, { recursive: true });
  }
});

Deno.test("returns a single PDF file", async () => {
  const directory = await Deno.makeTempDir();
  const file = join(directory, "product.pdf");

  try {
    await Deno.writeTextFile(file, "");

    assertEquals(await getPdfInputs(file), [file]);
  } finally {
    await Deno.remove(directory, { recursive: true });
  }
});

Deno.test("accepts a URL to a PDF file", async () => {
  const url = "https://www.vw-group.pl/data/MSDS/G__052910A2.pdf";

  assertEquals(await getPdfInputs(url), [url]);
});

Deno.test("rejects directories without PDF files", async () => {
  const directory = await Deno.makeTempDir();

  try {
    await assertRejects(
      () => getPdfInputs(directory),
      Error,
      "No PDF files found",
    );
  } finally {
    await Deno.remove(directory, { recursive: true });
  }
});
