import type { SdsResult } from "./mod.ts";

export function renderCsv(results: SdsResult[]): string {
  const rows = [
    [
      "Plik",
      "Nazwa handlowa",
      "Kod produktu",
      "Data pierwszego wydania",
      "Aktualizacja",
      "Wersja",
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

function escapeCsv(value: string): string {
  if (!/[",\r\n]/.test(value)) {
    return value;
  }

  return `"${value.replaceAll('"', '""')}"`;
}
