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
    { header: "File", key: "file", width: 40 },
    { header: "Trade name", key: "name", width: 45 },
    { header: "Product code", key: "code", width: 25 },
    { header: "UFI", key: "ufi", width: 21 },
    {
      header: "Initial issue date",
      key: "issueDate",
      width: 16,
    },
    { header: "Revision date", key: "revisionDate", width: 13 },
    { header: "Revision", key: "revision", width: 9 },
  ];

  for (const result of results) {
    worksheet.addRow({
      file: result.file,
      name: result.product.name,
      code: result.product.code,
      ufi: result.product.ufi ?? "",
      issueDate: result.document.issueDate,
      revisionDate: result.document.revisionDate,
      revision: result.document.revision,
    });
  }

  worksheet.getRow(1).font = { bold: true };
  worksheet.views = [{ state: "frozen", ySplit: 1 }];

  await workbook.xlsx.writeFile(outputPath);
}
