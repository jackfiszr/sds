import sdsparse from "./deno.json" with { type: "json" };
import { Command } from "@cliffy/command";
import { extractPdfText } from "./src/pdf/extract.ts";
import { parseSds } from "./src/sds/parse.ts";
import { getPdfInputs, readPdfInput } from "./src/input.ts";
import type { OutputFormat, SdsResult } from "./src/output/formats/mod.ts";
import { writeOutput } from "./src/output/write.ts";

/** Parses the command-line arguments and processes the requested PDF input. */
async function main(): Promise<void> {
  const command = new Command()
    .name("sdsparse")
    .version(sdsparse.version)
    .description("Parse Safety Data Sheets.")
    .option(
      "--json",
      "Output JSON.",
      {
        conflicts: ["csv", "xlsx"],
      },
    )
    .option(
      "--csv",
      "Write CSV output. Domyślna nazwa: sdsparse.csv.",
      {
        conflicts: ["json", "xlsx"],
      },
    )
    .option(
      "--xlsx",
      "Write XLSX output. Domyślna nazwa: sdsparse.xlsx.",
      {
        conflicts: ["json", "csv"],
      },
    )
    .option(
      "-o, --output <file:file>",
      "Nazwa pliku wyjściowego. Rozszerzenie zostanie dodane automatycznie.",
    )
    .arguments("[input:file]")
    .action(async (options, input) => {
      const inputPath = input ?? ".";
      const format = getOutputFormat(options);
      const inputs = await getPdfInputs(inputPath);
      const results: SdsResult[] = [];

      for (const input of inputs) {
        try {
          console.error(`Parsowanie: ${input}`);

          const pages = await extractPdfText(await readPdfInput(input));
          const sds = parseSds(pages);

          results.push({
            file: input,
            ...sds,
          });
        } catch (error) {
          const message = error instanceof Error
            ? error.message
            : String(error);

          console.error(`Błąd: ${input}: ${message}`);
        }
      }

      if (results.length === 0) {
        throw new Error(
          "Nie udało się sparsować żadnego pliku PDF.",
        );
      }

      await writeOutput(results, format);
    });

  await command.parse();
}

/**
 * Selects the output format requested by the CLI options.
 *
 * @param options Parsed output-format flags.
 * @returns The selected format, or the terminal table format by default.
 */
function getOutputFormat(
  options: {
    json?: true;
    csv?: true;
    xlsx?: true;
  },
): OutputFormat {
  if (options.json) return "json";
  if (options.csv) return "csv";
  if (options.xlsx) return "xlsx";
  return "table";
}

try {
  await main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Błąd: ${message}`);
  Deno.exit(1);
}
