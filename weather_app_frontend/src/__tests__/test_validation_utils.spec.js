 /**
  * Traceability: REQ-FE-VAL-001; VP-FE-VAL-001
  * GxP Impact: YES (Validation Controls)
  * Purpose: Validate city input function including boundaries, international chars, punctuation, and error messaging.
  */
import { validateCityQuery } from "../utils/validation";

describe("Validation Utilities - validateCityQuery (GxP)", () => {
  test("rejects null and undefined", () => {
    expect(validateCityQuery(null).valid).toBe(false);
    expect(validateCityQuery(undefined).valid).toBe(false);
  });

  test("trims whitespace-only input and rejects with message", () => {
    const res = validateCityQuery("   \n\t ");
    expect(res.valid).toBe(false);
    expect(res.error).toMatch(/please enter a city name/i);
  });

  test("accepts allowed punctuation and diacritics", () => {
    const name = "São Paulo, BR";
    const res = validateCityQuery(name);
    expect(res.valid).toBe(true);
    expect(res.cleaned).toBe(name);
  });

  test("rejects strings exceeding 64 chars", () => {
    const res = validateCityQuery("x".repeat(65));
    expect(res.valid).toBe(false);
    expect(res.error).toMatch(/too long/i);
  });

  test("rejects invalid characters", () => {
    const res = validateCityQuery("Berlin<>");
    expect(res.valid).toBe(false);
    expect(res.error).toMatch(/letters, spaces, hyphens, apostrophes, periods, or commas/i);
  });

  test("accepts names with hyphens and apostrophes", () => {
    const res = validateCityQuery("St.-John's");
    expect(res.valid).toBe(true);
    expect(res.cleaned).toBe("St.-John's");
  });
});
