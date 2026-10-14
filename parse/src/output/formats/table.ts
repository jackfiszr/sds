import { basename } from "@std/path";
import { Table } from "@cliffy/table";
import type { SdsResult } from "./mod.ts";

/** Renders SDS results as a formatted terminal table. */
export function renderTable(results: SdsResult[]): string {
  const hasUfi = results.some((result) => result.product.ufi);

  return new Table()
    .header([
      "File",
      "Trade name",
      "Product code",
      ...(hasUfi ? ["UFI"] : []),
      "Initial issue date",
      "Revision date",
      "Revision",
    ])
    .body(
      results.map((result) => [
        basename(result.file),
        result.product.name,
        result.product.code,
        ...(hasUfi ? [result.product.ufi ?? ""] : []),
        result.document.issueDate,
        result.document.revisionDate,
        result.document.revision,
      ]),
    )
    .border(true)
    .maxColWidth(
      hasUfi ? [35, 45, 25, 19, 18, 18, 10] : [35, 45, 25, 18, 18, 10],
    )
    .toString();
}
