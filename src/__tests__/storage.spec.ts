import { describe, it, beforeEach, expect } from "vitest";
import { storage } from "../storage";
import type { NotesMap } from "../types";

describe("storage (fallback to localStorage)", () => {
  const sampleNotes: NotesMap = {
    cressup: {
      note: "BBC journalist",
      update_date: "2023-01-01T12:00:00Z",
    },
    cupcake_the_otter: {
      note: "cute chaos energy",
      update_date: "2023-01-02T15:30:00Z",
    },
  };

  beforeEach(() => {
    localStorage.clear();
  });

  it("saves and retrieves notes via localStorage", async () => {
    await storage.setNotes(sampleNotes);

    const result = await storage.getNotes();
    expect(result).toEqual(sampleNotes);
  });

  it("returns empty object if nothing saved yet", async () => {
    const result = await storage.getNotes();
    expect(result).toEqual({});
  });

  it("computes approximate bytes used", async () => {
    await storage.setNotes(sampleNotes);
    const bytes = await storage.getBytesUsed();
    expect(bytes).toBeGreaterThan(0);
  });
});
