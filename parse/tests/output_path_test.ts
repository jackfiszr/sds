import { assertEquals, assertThrows } from "@std/assert";
import { resolveOutputPath } from "../src/output/path.ts";

Deno.test("adds the CSV extension", () => {
  assertEquals(
    resolveOutputPath("csv", "wynik"),
    "wynik.csv",
  );
});

Deno.test("does not duplicate the CSV extension", () => {
  assertEquals(
    resolveOutputPath("csv", "wynik.csv"),
    "wynik.csv",
  );
});

Deno.test("accepts an uppercase extension", () => {
  assertEquals(
    resolveOutputPath("xlsx", "wynik.XLSX"),
    "wynik.XLSX",
  );
});

Deno.test("rejects an invalid extension", () => {
  assertThrows(
    () => resolveOutputPath("csv", "wynik.xlsx"),
    Error,
    "Invalid output file extension",
  );
});

Deno.test("uses the default CSV filename", () => {
  assertEquals(
    resolveOutputPath("csv"),
    "sdsparse.csv",
  );
});

Deno.test("uses the default XLSX filename", () => {
  assertEquals(
    resolveOutputPath("xlsx"),
    "sdsparse.xlsx",
  );
});

Deno.test("writes JSON to stdout by default", () => {
  assertEquals(
    resolveOutputPath("json"),
    undefined,
  );
});

Deno.test("writes the table to stdout by default", () => {
  assertEquals(
    resolveOutputPath("table"),
    undefined,
  );
});
