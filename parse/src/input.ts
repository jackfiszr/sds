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
      throw new Error(`Path not found: ${input}`);
    }

    throw error;
  }

  if (stat.isFile) {
    if (!isPdf(input)) {
      throw new Error(`File is not a PDF: ${input}`);
    }

    return [input];
  }

  if (!stat.isDirectory) {
    throw new Error(`Unsupported input type: ${input}`);
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
      `No PDF files found in directory: ${input}`,
    );
  }

  return files;
}

export async function readPdfInput(input: PdfInput): Promise<Uint8Array> {
  if (isUrl(input)) {
    const response = await fetch(input);

    if (!response.ok) {
      throw new Error(
        `Failed to download PDF: ${response.status} ${response.statusText}`,
      );
    }

    const contentType = response.headers.get("content-type");
    const bytes = new Uint8Array(await response.arrayBuffer());

    if (!isPdfContent(bytes)) {
      throw new Error(
        `URL did not return a PDF file (Content-Type: ${
          contentType ?? "missing"
        }).`,
      );
    }

    return bytes;
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

function isPdfContent(bytes: Uint8Array): boolean {
  return (
    bytes.length >= 5 &&
    bytes[0] === 0x25 && // %
    bytes[1] === 0x50 && // P
    bytes[2] === 0x44 && // D
    bytes[3] === 0x46 && // F
    bytes[4] === 0x2d // -
  );
}
