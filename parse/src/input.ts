import { join } from "@std/path";

export type PdfInput = string;

export async function getPdfInputs(input: string): Promise<PdfInput[]> {
  if (isUrl(input)) {
    return [input];
  }

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

export async function readPdfInput(input: PdfInput): Promise<Uint8Array> {
  if (isUrl(input)) {
    const response = await fetch(input);

    if (!response.ok) {
      throw new Error(
        `Nie udało się pobrać PDF: ${response.status} ${response.statusText}`,
      );
    }

    const contentType = response.headers.get("content-type");

    if (contentType && !contentType.toLowerCase().includes("application/pdf")) {
      throw new Error(
        `URL nie zwrócił pliku PDF (Content-Type: ${contentType}).`,
      );
    }

    return new Uint8Array(await response.arrayBuffer());
  }

  return await Deno.readFile(input);
}

function isUrl(input: string): boolean {
  try {
    const url = new URL(input);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isPdf(path: string): boolean {
  return path.toLowerCase().endsWith(".pdf");
}
