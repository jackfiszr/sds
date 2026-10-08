import ExcelJS from "exceljs";
import type { SdsResult } from "./mod.ts";

/**
 * Writes SDS results to an XLSX workbook.
 *
 * @param results Parsed SDS records to write.
 * @param outputPath Destination workbook path.
 */
export async function writeXlsx(
  results: SdsResult[],
  outputPath: string,
): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("SDS");

  worksheet.columns = [
    { header: "Plik", key: "file", width: 40 },
    { header: "Nazwa handlowa", key: "name", width: 45 },
    { header: "Kod produktu", key: "code", width: 25 },
    {
      header: "Data pierwszego wydania",
      key: "issueDate",
      width: 22,
    },
    { header: "Aktualizacja", key: "revisionDate", width: 18 },
    { header: "Wersja", key: "revision", width: 12 },
  ];

  for (const result of results) {
    worksheet.addRow({
      file: result.file,
      name: result.product.name,
      code: result.product.code,
      issueDate: result.document.issueDate,
      revisionDate: result.document.revisionDate,
      revision: result.document.revision,
    });
  }

  worksheet.getRow(1).font = { bold: true };
  worksheet.views = [{ state: "frozen", ySplit: 1 }];

  await workbook.xlsx.writeFile(outputPath);
}
