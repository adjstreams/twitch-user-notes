import { describe, it, vi, beforeEach, expect } from "vitest";
import { MockStorageProvider } from "@tests/unit/__mocks__/mockStorage";
import { initNoteWatcher } from "@src/content/injection";
import type { NotesMap } from "@src/types";

// Simulate prompt and DOM for testing
const promptMock = vi.fn();
global.prompt = promptMock;

describe("content.ts", () => {
  let storage: MockStorageProvider;
  let triggerMessage: ((msg: unknown) => void) | null = null;

  const testNotes: NotesMap = {
    user1: { note: "existing note", update_date: "2024-01-01" },
  };

  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = "";

    // Reset mocks
    vi.resetAllMocks();
    storage = new MockStorageProvider({ ...testNotes });

    // Mock required APIs
    global.chrome = {
      runtime: {
        sendMessage: vi.fn(),
        onMessage: {
          addListener: vi.fn((cb) => {
            // expose for tests
            triggerMessage = cb;
          }),
        },
      },
      storage: {
        onChanged: {
          addListener: vi.fn(),
        },
      },
    } as unknown as typeof chrome;
  });

  it("initializes notesCache from storage", async () => {
    initNoteWatcher(storage);

    const result = await storage.get();
    expect(result).toEqual(testNotes);
  });

  it("responds to PROMPT_NOTE and updates note", async () => {
    promptMock.mockReturnValue("new updated note");

    initNoteWatcher(storage);

    // Simulate message
    triggerMessage?.({ type: "PROMPT_NOTE", login: "user1" });

    const updated = await storage.get();
    expect(updated.user1.note).toBe("new updated note");
    expect(updated.user1.update_date).toMatch(/20\d{2}-\d{2}-\d{2}/);
  });

  it("deletes note if prompt is empty", async () => {
    promptMock.mockReturnValue("   "); // just whitespace

    initNoteWatcher(storage);

    triggerMessage?.({ type: "PROMPT_NOTE", login: "user1" });

    const updated = await storage.get();
    expect(updated.user1).toBeUndefined();
  });

  it("does nothing if prompt is cancelled", async () => {
    promptMock.mockReturnValue(null);

    initNoteWatcher(storage);

    triggerMessage?.({ type: "PROMPT_NOTE", login: "user1" });

    const updated = await storage.get();
    expect(updated.user1).toEqual(testNotes.user1);
  });
});
