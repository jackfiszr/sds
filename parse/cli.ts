import sdsparse from "./deno.json" with { type: "json" };
import { Command } from "@cliffy/command";
import { extractPdfText } from "./src/pdf/extract.ts";

const command = new Command()
  .name("sdsparse")
  .version(sdsparse.version)
  .description("Parse Safety Data Sheets.")
  .arguments("<input:string>")
  .action(async (_options, input) => {
    await extractPdfText(await Deno.readFile(input)).then((pages) => {
      for (const page of pages) {
        console.log(`Page ${page.pageNumber}:`);
        console.log(page.text);
        console.log("\n");
        Deno.exit(0);
      }
    });
  });

await command.parse();
