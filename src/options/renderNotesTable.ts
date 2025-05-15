import {
  attachEditHandler,
  attachDeleteHandler,
} from "./noteInteractionHandlers";
import type { NotesMap, IStorageProvider } from "../types";
import { formatNoteDate } from "./formatNoteDate";

/**
 * Renders a table of Twitch user notes into the DOM.
 * Each row includes username, note content with an edit button, update timestamp, and a delete button.
 * Edit/delete actions automatically trigger re-rendering upon success.
 *
 * @param {NotesMap} notes - The full set of notes to display.
 * @param {IStorageProvider} storage - The storage backend to use for persistence.
 *
 * @remarks
 * This function directly mutates the DOM. It assumes a <tbody> element exists on the page.
 * Rendering order is sorted alphabetically by Twitch username.
 * Editing or deleting a note will replace the table row and re-trigger this function with updated data.
 */
export function renderNotesTable(
  notes: NotesMap,
  storage: IStorageProvider,
): void {
  const tbody = document.querySelector("tbody");
  const sortMode = document.querySelector("#sort") as HTMLSelectElement | null;
  if (!tbody) return;
  if (!sortMode) return;

  tbody.innerHTML = "";

  const sortedNotes = Object.entries(notes).sort((a, b) => {
    if (sortMode.value === "alpha") {
      return a[0].localeCompare(b[0]);
    } else {
      return (
        new Date(b[1].update_date).getTime() -
        new Date(a[1].update_date).getTime()
      );
    }
  });

  sortedNotes.forEach(([login, note]) => {
    const tr = (tbody as HTMLTableSectionElement).insertRow();
    tr.insertCell().textContent = login;

    const tdNote = tr.insertCell();
    tdNote.textContent = note.note;

    const editBtn = document.createElement("button");
    editBtn.className = "icon";
    editBtn.innerHTML = "✏️";
    editBtn.title = "Edit note";
    tdNote.appendChild(editBtn);

    editBtn.onclick = () => {
      attachEditHandler(
        tdNote,
        login,
        notes,
        (updated) => {
          renderNotesTable(updated, storage);
        },
        storage,
      );
    };

    tr.insertCell().textContent = formatNoteDate(note.update_date);

    const del = tr.insertCell();
    const delBtn = document.createElement("button");
    delBtn.textContent = "🗑️";
    delBtn.title = "Delete note";
    delBtn.className = "icon";
    del.appendChild(delBtn);

    attachDeleteHandler(
      delBtn,
      login,
      notes,
      (updated) => {
        renderNotesTable(updated, storage);
      },
      storage,
    );
  });
}
