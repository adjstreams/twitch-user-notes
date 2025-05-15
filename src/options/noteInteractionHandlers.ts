/**
 * Binds UI interaction handlers for editing and deleting notes within a table cell.
 * These handlers update the DOM and sync changes to the storage backend.
 */

import type { IStorageProvider } from "../types";
import type { NotesMap } from "../types";

/**
 * Replaces the table cell with a textarea and Save/Cancel buttons.
 * On save, updates the note in storage and triggers the onChange callback.
 * On cancel, re-renders the original view via onChange.
 *
 * @param {HTMLTableCellElement} tdNote - The table cell containing the note.
 * @param {string} login - The Twitch username associated with the note.
 * @param {NotesMap} notes - The current in-memory notes.
 * @param {Function} onChange - Called after note is updated or cancelled.
 * @param {IStorageProvider} storage - Storage backend to persist the note.
 */
export function attachEditHandler(
  tdNote: HTMLTableCellElement,
  login: string,
  notes: NotesMap,
  onChange: (updated: NotesMap) => void,
  storage: IStorageProvider,
): void {
  tdNote.innerHTML = "";

  const input = document.createElement("textarea");
  input.value = notes[login].note;
  input.rows = 3;
  input.style.width = "100%";
  tdNote.appendChild(input);

  const saveBtn = document.createElement("button");
  saveBtn.textContent = "💾";
  saveBtn.title = "Save note";
  saveBtn.className = "icon";

  const cancelBtn = document.createElement("button");
  cancelBtn.textContent = "✖️";
  cancelBtn.title = "Cancel";
  cancelBtn.className = "icon";

  const controls = document.createElement("div");
  controls.className = "note-edit-controls";
  controls.appendChild(saveBtn);
  controls.appendChild(cancelBtn);
  tdNote.appendChild(controls);

  saveBtn.onclick = async () => {
    notes[login] = {
      note: input.value.trim(),
      update_date: new Date().toISOString(),
    };
    await storage.set(notes);
    onChange(notes);
  };

  cancelBtn.onclick = () => {
    onChange(notes);
  };
}

/**
 * Attaches a click handler to a delete button.
 * Prompts the user for confirmation, removes the note from memory and storage,
 * and calls onChange if confirmed.
 *
 * @param {HTMLButtonElement} delBtn - Button element to bind the delete action.
 * @param {string} login - Twitch username whose note should be deleted.
 * @param {NotesMap} notes - The current in-memory notes.
 * @param {Function} onChange - Callback after deletion.
 * @param {IStorageProvider} storage - Storage backend for syncing changes.
 */
export function attachDeleteHandler(
  delBtn: HTMLButtonElement,
  login: string,
  notes: NotesMap,
  onChange: (updated: NotesMap) => void,
  storage: IStorageProvider,
): void {
  delBtn.onclick = async () => {
    if (confirm(`Delete note for ${login}?`)) {
      delete notes[login];
      await storage.set(notes);
      onChange(notes);
    }
  };
}
