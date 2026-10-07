import { basename } from "@std/path";
import { Table } from "@cliffy/table";
import type { SdsResult } from "./mod.ts";

export function renderTable(results: SdsResult[]): string {
  return new Table()
    .header([
      "Plik",
      "Nazwa handlowa",
      "Kod produktu",
      "Data pierwszego wydania",
      "Aktualizacja",
      "Wersja",
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
    .maxColWidth([35, 40, 25, 22, 18, 12])
    .toString();
}
