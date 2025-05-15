import type { NotesMap, IStorageProvider } from "@src/types";

export class MockStorageProvider implements IStorageProvider {
  private store: NotesMap;

  constructor(initialData: NotesMap = {}) {
    this.store = { ...initialData };
  }

  async get(): Promise<NotesMap> {
    return { ...this.store };
  }

  async set(notes: NotesMap): Promise<void> {
    this.store = { ...notes };
  }

  async getBytesUsed(): Promise<number> {
    const raw = JSON.stringify(this.store);
    return new Blob([raw]).size;
  }
}
