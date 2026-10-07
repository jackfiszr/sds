import type { SdsResult } from "./mod.ts";

export function renderJson(results: SdsResult[]): string {
  return JSON.stringify(results, null, 2);
}
