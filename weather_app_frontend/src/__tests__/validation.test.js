import { validateCityQuery } from "../utils/validation";

describe("validateCityQuery", () => {
  test("rejects empty", () => {
    const r = validateCityQuery("   ");
    expect(r.valid).toBe(false);
  });

  test("accepts letters and spaces", () => {
    const r = validateCityQuery("New York");
    expect(r.valid).toBe(true);
    expect(r.cleaned).toBe("New York");
  });

  test("rejects too long", () => {
    const r = validateCityQuery("x".repeat(65));
    expect(r.valid).toBe(false);
  });

  test("rejects invalid chars", () => {
    const r = validateCityQuery("Paris!@#");
    expect(r.valid).toBe(false);
  });
});
