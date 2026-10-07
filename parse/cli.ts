import sdsparse from "./deno.json" with { type: "json" };
import { Command } from "@cliffy/command";
import { extractPdfText } from "./src/pdf/extract.ts";
import { parseSds } from "./src/sds/parse.ts";

const command = new Command()
  .name("sdsparse")
  .version(sdsparse.version)
  .description("Parse Safety Data Sheets.")
  .arguments("<input:string>")
  .action(async (_options, input) => {
    const pages = await extractPdfText(await Deno.readFile(input));
    const sds = parseSds(pages);
    console.log(JSON.stringify(sds, null, 2));
  });

await command.parse();
