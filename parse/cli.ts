import sdsparse from "./deno.json" with { type: "json" };
import { Command } from "@cliffy/command";

const command = new Command()
  .name("sdsparse")
  .version(sdsparse.version)
  .description("Parse Safety Data Sheets.")
  .arguments("<input:string>")
  .action((_options, input) => {
    console.log(`Parsing input: ${input}`);
  });

await command.parse();
