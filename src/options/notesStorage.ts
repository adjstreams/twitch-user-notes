import type { NotesMap, IStorageProvider } from "../types";
import { isValidNotesMap, showStorageUsage } from "./notesUtils";

/**
 * Loads all notes from the provided storage backend and validates the format.
 *
 * @param {IStorageProvider} storage - The storage backend implementing get().
 * @returns {Promise<NotesMap>} Resolves to a valid NotesMap object or an empty one if the data is invalid.
 */
export async function loadNotes(storage: IStorageProvider): Promise<NotesMap> {
  const result = await storage.get();
  return isValidNotesMap(result) ? result : {};
}

/**
 * Attempts to import a set of notes from a JSON file, validate it, and persist it.
 * On success, the notes are rendered and usage info is shown; on failure, an error message is raised.
 *
 * @param {File} file - The user-provided JSON file containing notes.
 * @param {IStorageProvider} storage - The storage backend for persistence.
 * @param {(notes: NotesMap) => void} onRender - Callback to render notes after successful import.
 * @param {(msg: string) => void} onError - Callback to show error messages.
 * @param {HTMLElement | null} summaryEl - Optional element to display storage usage info.
 * @returns {Promise<void>} Resolves once the import flow completes.
 */
export async function saveImportedNotes(
  file: File,
  storage: IStorageProvider,
  onRender: (notes: NotesMap) => void,
  onError: (msg: string) => void,
  summaryEl: HTMLElement | null,
): Promise<void> {
  try {
    const text = await file.text();
    const parsed = JSON.parse(text);
    if (!isValidNotesMap(parsed)) {
      return onError("Invalid note format.");
    }
    await storage.set(parsed);
    onRender(parsed);
    showStorageUsage(parsed, summaryEl);
  } catch {
    onError("Failed to parse file.");
  }
}
