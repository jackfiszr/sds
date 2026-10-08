import { basename } from "@std/path";
import { Table } from "@cliffy/table";
import type { SdsResult } from "./mod.ts";

/** Renders SDS results as a formatted terminal table. */
export function renderTable(results: SdsResult[]): string {
  return new Table()
    .header([
      "File",
      "Trade name",
      "Product code",
      "Initial issue date",
      "Revision date",
      "Revision",
    ])
    .body(
      results.map((result) => [
        basename(result.file),
        result.product.name,
        result.product.code,
        result.document.issueDate,
        result.document.revisionDate,
        result.document.revision,
      ]),
    )
    .border(true)
    .maxColWidth([35, 45, 25, 18, 18, 10])
    .toString();
}
