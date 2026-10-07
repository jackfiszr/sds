import { assertEquals, assertRejects } from "@std/assert";
import { getPdfFiles } from "../src/input.ts";
import { join } from "@std/path";

Deno.test("znajduje pliki PDF w katalogu", async () => {
  const directory = await Deno.makeTempDir();

  try {
    await Deno.writeTextFile(join(directory, "b.pdf"), "");
    await Deno.writeTextFile(join(directory, "a.PDF"), "");
    await Deno.writeTextFile(join(directory, "not-pdf.txt"), "");

    const files = await getPdfFiles(directory);

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

    assertEquals(await getPdfFiles(file), [file]);
  } finally {
    await Deno.remove(directory, { recursive: true });
  }
});

Deno.test("odrzuca brak plików PDF", async () => {
  const directory = await Deno.makeTempDir();

  try {
    await assertRejects(
      () => getPdfFiles(directory),
      Error,
      "nie znaleziono plików PDF",
    );
  } finally {
    await Deno.remove(directory, { recursive: true });
  }
});
