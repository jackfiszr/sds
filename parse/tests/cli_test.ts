import { assertEquals, assertStringIncludes } from "@std/assert";
import { join } from "@std/path";
import { fromFileUrl } from "@std/path/from-file-url";

const cliPath = fromFileUrl(new URL("../cli.ts", import.meta.url));
const fixturePath = fromFileUrl(
  new URL("../fixtures/example.pdf", import.meta.url),
);

Deno.test("uses the custom output filename", async () => {
  const tempDir = await Deno.makeTempDir();

  try {
    const { code, stderr } = await new Deno.Command(Deno.execPath(), {
      args: [
        "run",
        "-A",
        cliPath,
        fixturePath,
        "--csv",
        "--output",
        "customowa_nazwa_pliku",
      ],
      cwd: tempDir,
      stdout: "piped",
      stderr: "piped",
    }).output();

    const errorOutput = new TextDecoder().decode(stderr);

    assertEquals(code, 0, errorOutput);
    assertStringIncludes(
      errorOutput,
      "Output saved to: customowa_nazwa_pliku.csv",
    );

    await Deno.stat(join(tempDir, "customowa_nazwa_pliku.csv"));
  } finally {
    await Deno.remove(tempDir, { recursive: true });
  }
});
