import { describe, it, expect, vi, beforeEach } from "vitest";
import { isValidNotesMap, showStorageUsage } from "@src/options/notesUtils";
import type { NotesMap } from "@src/types";

describe("notesUtils.ts", () => {
  beforeEach(() => {
    globalThis.chrome = {
      storage: {
        local: {
          getBytesInUse: vi.fn().mockResolvedValue(2048),
        },
      },
    } as unknown as typeof chrome;
  });

  it("validates correct NotesMap", () => {
    const notes: NotesMap = {
      user1: { note: "hello", update_date: new Date().toISOString() },
    };
    expect(isValidNotesMap(notes)).toBe(true);
  });

  it("rejects invalid NotesMap", () => {
    const bad = {
      user1: { note: 123, update_date: false },
    };
    expect(isValidNotesMap(bad)).toBe(false);
  });

  it("updates DOM with storage usage summary", async () => {
    const container = document.createElement("div");
    container.innerHTML = `
      <div id="storage-bar-fill"></div>
      <div id="storage-bar-text"></div>
    `;

    const notes: NotesMap = {
      user1: { note: "1", update_date: "now" },
      user2: { note: "2", update_date: "now" },
    };

    await showStorageUsage(notes, container);

    const text = container.querySelector("#storage-bar-text")?.textContent;

    expect(text).toMatch(/2 note/);
    expect(text).toMatch(/KB/);
    expect(text).toMatch(/%/);
  });
});
