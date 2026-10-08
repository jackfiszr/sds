import { assertEquals, assertRejects } from "@std/assert";
import { join } from "@std/path";
import { getPdfInputs } from "../src/input.ts";

Deno.test("znajduje pliki PDF w katalogu", async () => {
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

Deno.test("zwraca pojedynczy plik PDF", async () => {
  const directory = await Deno.makeTempDir();
  const file = join(directory, "product.pdf");

  try {
    await Deno.writeTextFile(file, "");

    assertEquals(await getPdfInputs(file), [file]);
  } finally {
    await Deno.remove(directory, { recursive: true });
  }
});

Deno.test("akceptuje URL do pliku PDF", async () => {
  const url = "https://www.vw-group.pl/data/MSDS/G__052910A2.pdf";

  assertEquals(await getPdfInputs(url), [url]);
});

Deno.test("odrzuca brak plików PDF", async () => {
  const directory = await Deno.makeTempDir();

  try {
    await assertRejects(
      () => getPdfInputs(directory),
      Error,
      "nie znaleziono plików PDF",
    );
  } finally {
    await Deno.remove(directory, { recursive: true });
  }
});
