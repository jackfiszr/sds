import type { SdsResult } from "./mod.ts";

/** Serializes SDS results as indented JSON. */
export function renderJson(results: SdsResult[]): string {
  return JSON.stringify(results, null, 2);
}
