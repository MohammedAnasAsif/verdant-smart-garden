import { describe, it, expect } from "vitest";
import { sanitizeText, sanitizeQuery } from "@/lib/sanitize";

/**
 * Security property: output must never contain characters that can
 * escape a text context (markup delimiters, quotes, template chars).
 * Exact residual wording is irrelevant — React escapes text nodes,
 * and these chars guarantee no attribute/tag injection even if
 * someone later renders into raw HTML.
 */
const DANGEROUS = ["<", ">", "&", '"', "'", "`", "\\", "{", "}", "$"] as const;

describe("sanitizeText — XSS hardening", () => {
  it.each([
    "<script>alert(1)</script>",
    '<img src=x onerror="alert(1)">',
    "<svg/onload=alert(1)>",
    'javascript:alert(1)<a href="x">',
    "<<>>",
  ])("strips markup delimiters from %j", (payload) => {
    const out = sanitizeText(payload);
    for (const ch of DANGEROUS) {
      expect(out).not.toContain(ch);
    }
  });

  it("removes quotes, backticks and template placeholders", () => {
    const out = sanitizeText("`'; DROP TABLE events; --${process.env.SECRET}");
    for (const ch of ["`", "'", '"', "$", "{", "}"]) {
      expect(out).not.toContain(ch);
    }
    expect(out.toLowerCase()).not.toContain("${");
  });

  it("strips control characters", () => {
    const out = sanitizeText("abc\u0000\u0007\u001b[31mdef");
    expect(out).toMatch(/^[^\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]*$/);
    expect(out).not.toContain("\u001b");
  });

  it("collapses whitespace and trims", () => {
    expect(sanitizeText("  a   b\tc\n\n ")).toBe("a b c");
  });

  it("hard-caps length at 80 by default", () => {
    expect(sanitizeText("x".repeat(500)).length).toBe(80);
    expect(sanitizeText("y".repeat(200), 10).length).toBe(10);
  });

  it("returns empty string for non-string input (type confusion defense)", () => {
    expect(sanitizeText(123)).toBe("");
    expect(sanitizeText(null)).toBe("");
    expect(sanitizeText(undefined)).toBe("");
    expect(sanitizeText({ a: 1 })).toBe("");
    expect(sanitizeText(["<script>"])).toBe("");
  });

  it("sanitizeQuery delegates with the right cap", () => {
    const out = sanitizeQuery("<b>vibes</b>");
    for (const ch of DANGEROUS) expect(out).not.toContain(ch);
    expect(out.toLowerCase()).toContain("vibes");
    expect(sanitizeQuery(42 as unknown as string)).toBe("");
  });
});
