# @sds/parse

Parser Safety Data Sheets (SDS) written in TypeScript for Deno.

## Features

* Extract text from SDS PDF files.
* Parse basic SDS metadata.
* Process a single PDF or multiple PDFs from a directory.
* Generate output as:

  * terminal table,
  * JSON,
  * CSV,
  * XLSX.
* Continue processing when an individual PDF cannot be parsed.

## Usage

### Parse the current directory

```bash
sdsparse
```

When no input is specified, the current directory is used.

All PDF files located directly in the current directory are processed.

### Parse a single PDF

```bash
sdsparse product.pdf
```

### Parse a directory

```bash
sdsparse ./sds
```

All PDF files located directly in the specified directory are processed.

Subdirectories are not searched recursively.

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

The `.csv` extension may also be specified explicitly.

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
--output with table → .txt
```

An existing extension is preserved when it matches the selected output format.

For example:

```bash
sdsparse --csv --output result
sdsparse --csv --output result.csv
```

Both produce:

```text
result.csv
```

An incompatible extension is rejected:

```bash
sdsparse --csv --output result.xlsx
```

## Command-line interface

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

If no format option is specified, a table is shown in the terminal.

## Processing multiple files

When a directory is used as input, each PDF is processed independently.

If an individual PDF cannot be parsed, an error is reported and processing continues with the remaining files.

The command exits with an error when no PDF can be parsed successfully.

## Development

Run the CLI:

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
