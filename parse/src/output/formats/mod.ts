export const OUTPUT_FORMATS = [
  "table",
  "json",
  "csv",
  "xlsx",
] as const;

export type OutputFormat = typeof OUTPUT_FORMATS[number];

export interface SdsResult {
  file: string;
  product: {
    name: string;
    code: string;
  };
  document: {
    issueDate: string;
    revisionDate: string;
    revision: string;
  };
}
