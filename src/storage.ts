import type { NotesMap } from "./types";

const isExtension = typeof chrome !== "undefined" && !!chrome.storage;

export const storage = {
  async getNotes(): Promise<NotesMap> {
    if (isExtension) {
      return new Promise((resolve) => {
        chrome.storage.local.get(["notes"], (res) => {
          resolve(res.notes || {});
        });
      });
    } else {
      const data = localStorage.getItem("notes");
      return data ? JSON.parse(data) : {};
    }
  },

  async setNotes(notes: NotesMap): Promise<void> {
    if (isExtension) {
      return new Promise((resolve) => {
        chrome.storage.local.set({ notes }, resolve);
      });
    } else {
      localStorage.setItem("notes", JSON.stringify(notes));
    }
  },

  async getBytesUsed(): Promise<number> {
    if (isExtension) {
      return new Promise((resolve) => {
        chrome.storage.local.getBytesInUse("notes", resolve);
      });
    } else {
      return new Blob([localStorage.getItem("notes") || ""]).size;
    }
  },
};
