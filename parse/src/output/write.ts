import { renderCsv } from "./formats/csv.ts";
import { renderJson } from "./formats/json.ts";
import { renderTable } from "./formats/table.ts";
import { writeXlsx } from "./formats/xlsx.ts";
import type { OutputFormat, SdsResult } from "./formats/mod.ts";
import { resolveOutputPath } from "./path.ts";

/**
 * Renders results in the selected format and writes them to the appropriate
 * destination.
 *
 * @param results Parsed SDS records to output.
 * @param format Output format.
 * @param output Optional destination path.
 */
export async function writeOutput(
  results: SdsResult[],
  format: OutputFormat,
  output?: string,
): Promise<void> {
  const outputPath = resolveOutputPath(format, output);

  if (format === "xlsx") {
    if (!outputPath) {
      throw new Error("Nie określono pliku wyjściowego XLSX.");
    }

    await writeXlsx(results, outputPath);
    console.error(`Zapisano wynik do: ${outputPath}`);
    return;
  }

  const content = format === "table"
    ? renderTable(results)
    : format === "json"
    ? renderJson(results)
    : renderCsv(results);

  if (outputPath) {
    await Deno.writeTextFile(outputPath, `${content}\n`);
    console.error(`Zapisano wynik do: ${outputPath}`);
    return;
  }

  console.log(content);
}
