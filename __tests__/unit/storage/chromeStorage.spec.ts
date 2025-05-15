import { mockChromeStorage } from "@tests/unit/__mocks__/mockChromeStorage";
import { ChromeStorage } from "@src/storage/chromeStorage";
import type { NotesMap } from "@src/types";

const mockNotes: NotesMap = {
  user1: { note: "Test note", update_date: "2024-05-12" },
};

describe("ChromeStorage.ts", () => {
  beforeEach(() => {
    mockChromeStorage({ notes: mockNotes });
  });

  it("gets notes from chrome storage", async () => {
    const storage = new ChromeStorage();
    const result = await storage.get();
    expect(result).toEqual(mockNotes);
  });

  it("returns empty object if notes are missing", async () => {
    mockChromeStorage({});
    const storage = new ChromeStorage();
    const result = await storage.get();
    expect(result).toEqual({});
  });

  it("sets notes in chrome storage", async () => {
    const setMock = vi.fn(
      (_items: Record<string, unknown>, callback?: () => void) => {
        if (callback) callback();
        return undefined;
      },
    );

    // Cast it so TypeScript accepts it as the correct signature
    (global.chrome.storage.local.set as unknown) = setMock;

    const storage = new ChromeStorage();
    await expect(storage.set(mockNotes)).resolves.toBeUndefined();
    expect(setMock).toHaveBeenCalledWith(
      { notes: mockNotes },
      expect.any(Function),
    );
  });

  it("gets bytes used for notes", async () => {
    const getBytesInUseMock = vi.fn(
      (_key: string, callback: (bytes: number) => void) => {
        callback(1234);
      },
    );

    (global.chrome.storage.local.getBytesInUse as unknown) = getBytesInUseMock;

    const storage = new ChromeStorage();
    const result = await storage.getBytesUsed();
    expect(result).toBe(1234);
  });
});
