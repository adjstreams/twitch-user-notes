import { saveImportedNotes } from "./notesStorage";
import type { NotesMap, IStorageProvider } from "../types";

export function bindExportBtn(button: HTMLElement, notes: NotesMap): void {
  button.addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(notes, null, 2)], {
      type: "application/json",
    });
    const a = Object.assign(document.createElement("a"), {
      href: URL.createObjectURL(blob),
      download: "twitch-notes.json",
    });
    a.click();
  });
}

export function bindImportBtn(
  input: HTMLInputElement,
  storage: IStorageProvider,
  onRender: (notes: NotesMap) => void,
  onError: (msg: string) => void,
  summaryEl: HTMLElement | null,
): void {
  input.addEventListener("change", async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    await saveImportedNotes(file, storage, onRender, onError, summaryEl);
  });
}
