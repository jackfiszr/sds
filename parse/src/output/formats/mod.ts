/** Output formats supported by the parser. */
export const OUTPUT_FORMATS = [
  "table",
  "json",
  "csv",
  "xlsx",
] as const;

/** A supported output format. */
export type OutputFormat = typeof OUTPUT_FORMATS[number];

/** A parsed SDS record associated with its source file. */
export interface SdsResult {
  /** Path to the PDF that produced this result. */
  file: string;
  /** Product identity fields. */
  product: {
    /** Commercial product name. */
    name: string;
    /** Product code. */
    code: string;
  };
  /** SDS issue and revision metadata, with dates in ISO format. */
  document: {
    /** Initial issue date in `YYYY-MM-DD` format. */
    issueDate: string;
    /** Latest revision date in `YYYY-MM-DD` format. */
    revisionDate: string;
    /** Document revision identifier. */
    revision: string;
  };
}
