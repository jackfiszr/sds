# @sds/parse

Parser Safety Data Sheets (SDS) written in TypeScript for Deno.

The package can be used both as a command-line application and as a library in
Deno or other TypeScript projects.

## Installation

### Command-line application

Install the `sdsparse` command globally:

```bash
deno install -gAr jsr:@sds/parse/cli
```

After installation:

```bash
sdsparse
```

Check the installed version:

```bash
sdsparse --version
```

Show available options:

```bash
sdsparse --help
```

### Library

Add the package to a Deno project:

```bash
deno add jsr:@sds/parse
```

Then import the parser from your TypeScript code:

```ts
import { parseSds } from "@sds/parse";
```

The PDF text extraction functionality can also be used independently:

```ts
import { extractPdfText } from "@sds/parse/pdf";
```

## Command-line usage

### Parse the current directory

```bash
sdsparse
```

When no input is specified, the current directory is used.

All PDF files located directly in the current directory are processed.

Subdirectories are not searched recursively.

### Parse a single PDF

```bash
sdsparse product.pdf
```

### Parse a directory

```bash
sdsparse ./sds
```

All PDF files located directly in the specified directory are processed.

## Output formats

The default output format is a terminal table.

```bash
sdsparse
```

### JSON

```bash
sdsparse --json
```

JSON is written to stdout.

To save it to a file:

```bash
sdsparse --json --output result
```

This creates:

```text
result.json
```

### CSV

```bash
sdsparse --csv
```

By default, the result is saved as:

```text
sdsparse.csv
```

A custom filename can be specified:

```bash
sdsparse --csv --output result
```

This creates:

```text
result.csv
```

### XLSX

```bash
sdsparse --xlsx
```

By default, the result is saved as:

```text
sdsparse.xlsx
```

A custom filename can be specified:

```bash
sdsparse --xlsx --output result
```

This creates:

```text
result.xlsx
```

## Output filenames

The `--output` option does not require a file extension.

The appropriate extension is added automatically:

```text
--json  → .json
--csv   → .csv
--xlsx  → .xlsx
```

An existing matching extension is preserved.

For example, both commands produce `result.csv`:

```bash
sdsparse --csv --output result
sdsparse --csv --output result.csv
```

An incompatible extension is rejected:

```bash
sdsparse --csv --output result.xlsx
```

## Command-line options

```text
Usage:
  sdsparse [input] [options]

Arguments:
  [input]  PDF file or directory containing PDF files.
           Default: current directory.

Options:
  --json                 Output JSON to stdout.
  --csv                  Write CSV output.
                         Default file: sdsparse.csv
  --xlsx                 Write XLSX output.
                         Default file: sdsparse.xlsx
  -o, --output <file>    Output filename. The extension is added automatically
                         when it is not specified.
  -h, --help             Show help.
  -V, --version          Show version.
```

The output format options are mutually exclusive.

When no output format is specified, a table is displayed in the terminal.

## Using the library

The package exposes the SDS parser independently of the command-line interface.

For example:

```ts
import { extractPdfText, parseSds } from "@sds/parse";

const data = await Deno.readFile("product.pdf");
const pages = await extractPdfText(data);
const sds = parseSds(pages);

console.log(sds);
```

The parser returns structured SDS data:

```ts
{
  product: {
    name: string;
    code: string;
  }
  document: {
    issueDate: string;
    revisionDate: string;
    revision: string;
  }
}
```

The CLI is built on top of the same library functionality, so the parsing logic
can be integrated into other Deno applications without invoking the `sdsparse`
command.

## Processing multiple files

When a directory is used as input, each PDF is processed independently.

If an individual PDF cannot be parsed, an error is reported and processing
continues with the remaining files.

The command exits with an error when no PDF can be parsed successfully.

## Development

Clone the repository and run the CLI directly:

```bash
deno run --allow-read --allow-write cli.ts
```

Run tests:

```bash
deno test
```

Format source files:

```bash
deno fmt
```

Lint the project:

```bash
deno lint
```
