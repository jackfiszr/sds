import type { SdsResult } from "./mod.ts";

/** Renders SDS results as CSV with CRLF-separated rows. */
export function renderCsv(results: SdsResult[]): string {
  const rows = [
    [
      "File",
      "Trade name",
      "Product code",
      "Initial issue date",
      "Revision date",
      "Revision",
    ],
    ...results.map((result) => [
      result.file,
      result.product.name,
      result.product.code,
      result.document.issueDate,
      result.document.revisionDate,
      result.document.revision,
    ]),
  ];

  return rows.map((row) => row.map(escapeCsv).join(",")).join("\r\n");
}

/** Escapes a CSV cell when it contains a delimiter, quote, or newline. */
function escapeCsv(value: string): string {
  if (!/[",\r\n]/.test(value)) {
    return value;
  }

  return `"${value.replaceAll('"', '""')}"`;
}
