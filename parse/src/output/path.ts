import { extname } from "@std/path";
import type { OutputFormat } from "./formats/mod.ts";

/**
 * Resolves the output filename for a format and optional user-supplied path.
 *
 * @param format Requested output format.
 * @param output Optional output path without or with its expected extension.
 * @returns The resolved path, or `undefined` when output should go to stdout.
 * @throws If the supplied path has an extension incompatible with the format.
 */
export function resolveOutputPath(
  format: OutputFormat,
  output?: string,
): string | undefined {
  if (!output) {
    switch (format) {
      case "csv":
        return "sdsparse.csv";
      case "xlsx":
        return "sdsparse.xlsx";
      case "table":
      case "json":
        return undefined;
    }
  }

  const extension = getExtension(format);
  const currentExtension = extname(output);

  if (!currentExtension || currentExtension === ".") {
    return `${output}${extension}`;
  }

  if (currentExtension.toLowerCase() !== extension) {
    throw new Error(
      `Invalid output file extension for format ${format}: ${currentExtension}. Expected ${extension}.`,
    );
  }

  return output;
}

/** Returns the filename extension associated with an output format. */
function getExtension(format: OutputFormat): string {
  switch (format) {
    case "table":
      return ".txt";
    case "json":
      return ".json";
    case "csv":
      return ".csv";
    case "xlsx":
      return ".xlsx";
  }
}
