import type { NotesMap, IStorageProvider } from "../types";

/**
 * ChromeStorage implements the IStorageProvider interface using Chrome's local storage API.
 * This class handles reading, writing, and checking usage of the "notes" object in storage.
 */
export class ChromeStorage implements IStorageProvider {
  /**
   * Retrieves the full notes map from chrome.storage.local.
   *
   * @returns {Promise<NotesMap>} Resolves to a NotesMap object or an empty object if nothing is stored.
   */
  async get(): Promise<NotesMap> {
    return new Promise((resolve) => {
      chrome.storage.local.get(["notes"], (res) => {
        resolve(res.notes || {});
      });
    });
  }

  /**
   * Stores the provided notes map in chrome.storage.local under the "notes" key.
   *
   * @param {NotesMap} notes - The full set of notes to persist.
   * @returns {Promise<void>} Resolves once the data has been saved.
   */
  async set(notes: NotesMap): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.set({ notes }, resolve);
    });
  }

  /**
   * Retrieves the number of bytes used by the "notes" key in storage.
   *
   * @returns {Promise<number>} Resolves to the number of bytes currently used.
   */
  async getBytesUsed(): Promise<number> {
    return new Promise((resolve) => {
      chrome.storage.local.getBytesInUse("notes", resolve);
    });
  }
}
