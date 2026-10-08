import { join } from "@std/path";

/**
 * Finds PDF files at the given path.
 *
 * A file path must point to a PDF. A directory is searched non-recursively, and
 * the returned paths are sorted alphabetically.
 *
 * @param input Path to a PDF file or directory.
 * @returns Matching PDF paths.
 * @throws If the path does not exist, is unsupported, or contains no PDFs.
 */
export async function getPdfFiles(input: string): Promise<string[]> {
  let stat: Deno.FileInfo;

  try {
    stat = await Deno.stat(input);
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      throw new Error(`Nie znaleziono ścieżki: ${input}`);
    }

    throw error;
  }

  if (stat.isFile) {
    if (!isPdf(input)) {
      throw new Error(`Plik nie jest plikiem PDF: ${input}`);
    }

    return [input];
  }

  if (!stat.isDirectory) {
    throw new Error(`Nieobsługiwany typ wejścia: ${input}`);
  }

  const files: string[] = [];

  for await (const entry of Deno.readDir(input)) {
    if (entry.isFile && isPdf(entry.name)) {
      files.push(join(input, entry.name));
    }
  }

  files.sort((a, b) => a.localeCompare(b));

  if (files.length === 0) {
    throw new Error(
      `W katalogu nie znaleziono plików PDF: ${input}`,
    );
  }

  return files;
}

/** Checks whether a path has a PDF file extension, ignoring letter case. */
function isPdf(path: string): boolean {
  return path.toLowerCase().endsWith(".pdf");
}
