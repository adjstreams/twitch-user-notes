import { describe, it, expect, vi } from "vitest";
import { loadNotes, saveImportedNotes } from "@src/options/notesStorage";
import type { IStorageProvider, NotesMap } from "@src/types";

describe("storageHelpers.ts", () => {
  const validNotes: NotesMap = {
    user1: { note: "x", update_date: "2024-01-01" },
  };

  const mockStorage = (): IStorageProvider => ({
    get: vi.fn().mockResolvedValue(validNotes),
    set: vi.fn().mockResolvedValue({}),
    getBytesUsed: vi.fn().mockResolvedValue(0),
  });

  it("loads valid notes from storage", async () => {
    const storage = mockStorage();
    const result = await loadNotes(storage);
    expect(result).toEqual(validNotes);
  });

  it("handles invalid JSON on import", async () => {
    const file = new File(["not json"], "bad.json", {
      type: "application/json",
    });
    File.prototype.text = vi.fn().mockResolvedValue("not json");

    const storage = mockStorage();
    const onRender = vi.fn();
    const onError = vi.fn();
    const summary = document.createElement("div");

    await saveImportedNotes(file, storage, onRender, onError, summary);
    expect(onError).toHaveBeenCalledWith("Failed to parse file.");
    expect(onRender).not.toHaveBeenCalled();
  });
});
