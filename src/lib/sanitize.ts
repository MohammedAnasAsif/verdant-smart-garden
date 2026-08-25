/**
 * Sanitizes free-text user input before it is echoed anywhere
 * (search queries, future user-generated fields).
 *
 * Strategy: strip HTML-delimiting characters and control characters,
 * collapse whitespace, hard-cap length. Defense in depth on top of
 * React's automatic escaping — we never inject raw HTML into the DOM.
 */
export function sanitizeText(input: unknown, maxLen = 80): string {
  if (typeof input !== "string") return "";
  return input
    .normalize("NFKC")
    // remove control chars except whitespace
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    // neutralize tag/attribute delimiters
    .replace(/[<>&"'`\\{}$]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLen);
}

/** Validates + sanitizes a search query for the events API. */
export function sanitizeQuery(input: unknown): string {
  return sanitizeText(input, 80);
}
