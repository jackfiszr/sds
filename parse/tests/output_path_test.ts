import { assertEquals, assertThrows } from "@std/assert";
import { resolveOutputPath } from "../src/output/path.ts";

Deno.test("dodaje rozszerzenie CSV", () => {
  assertEquals(
    resolveOutputPath("csv", "wynik"),
    "wynik.csv",
  );
});

Deno.test("nie duplikuje rozszerzenia CSV", () => {
  assertEquals(
    resolveOutputPath("csv", "wynik.csv"),
    "wynik.csv",
  );
});

Deno.test("akceptuje rozszerzenie zapisane wielkimi literami", () => {
  assertEquals(
    resolveOutputPath("xlsx", "wynik.XLSX"),
    "wynik.XLSX",
  );
});

Deno.test("odrzuca niewłaściwe rozszerzenie", () => {
  assertThrows(
    () => resolveOutputPath("csv", "wynik.xlsx"),
    Error,
    "Nieprawidłowe rozszerzenie",
  );
});

Deno.test("używa domyślnej nazwy CSV", () => {
  assertEquals(
    resolveOutputPath("csv"),
    "sdsparse.csv",
  );
});

Deno.test("używa domyślnej nazwy XLSX", () => {
  assertEquals(
    resolveOutputPath("xlsx"),
    "sdsparse.xlsx",
  );
});

Deno.test("JSON domyślnie trafia na stdout", () => {
  assertEquals(
    resolveOutputPath("json"),
    undefined,
  );
});

Deno.test("table domyślnie trafia na stdout", () => {
  assertEquals(
    resolveOutputPath("table"),
    undefined,
  );
});
