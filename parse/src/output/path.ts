import { extname } from "@std/path";
import type { OutputFormat } from "./formats/mod.ts";

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
      `Nieprawidłowe rozszerzenie pliku wyjściowego dla formatu ${format}: ${currentExtension}. Oczekiwano ${extension}.`,
    );
  }

  return output;
}

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
