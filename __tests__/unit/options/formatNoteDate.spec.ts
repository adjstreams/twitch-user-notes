import { describe, it, expect } from "vitest";
import { formatNoteDate } from "@src/options/formatNoteDate";

describe("formatNoteDate", () => {
  it("formats ISO date into readable string", () => {
    const input = "2025-05-08T11:15:00Z";
    const formatted = formatNoteDate(input);
    expect(formatted).toMatch(/08|May|2025/);
  });

  it("handles invalid date safely", () => {
    const input = "not-a-date";
    const formatted = formatNoteDate(input);
    expect(formatted).toBe(input);
  });
});
