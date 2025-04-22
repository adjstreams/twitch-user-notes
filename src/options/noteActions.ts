import { storage } from "../storage";
import type { NotesMap } from "../types";

export function attachEditHandler(
  tdNote: HTMLTableCellElement,
  login: string,
  notes: NotesMap,
  onChange: (updated: NotesMap) => void,
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

  tdNote.appendChild(saveBtn);
  tdNote.appendChild(cancelBtn);

  saveBtn.onclick = async () => {
    notes[login] = {
      note: input.value.trim(),
      update_date: new Date().toISOString(),
    };
    await storage.setNotes(notes);
    onChange(notes);
  };

  cancelBtn.onclick = () => {
    onChange(notes);
  };
}

export function attachDeleteHandler(
  delBtn: HTMLButtonElement,
  login: string,
  notes: NotesMap,
  onChange: (updated: NotesMap) => void,
): void {
  delBtn.onclick = async () => {
    if (confirm(`Delete note for ${login}?`)) {
      delete notes[login];
      await storage.setNotes(notes);
      onChange(notes);
    }
  };
}
