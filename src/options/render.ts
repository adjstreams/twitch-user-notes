import { attachEditHandler, attachDeleteHandler } from "./noteActions";
import type { NotesMap } from "../types";

export function render(notes: NotesMap): void {
  const tbody = document.querySelector("tbody");
  if (!tbody) return;

  tbody.innerHTML = "";
  Object.entries(notes)
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([login, note]) => {
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
        attachEditHandler(tdNote, login, notes, (updated) => {
          render(updated);
        });
      };

      tr.insertCell().textContent = new Date(note.update_date).toLocaleString();

      const del = tr.insertCell();
      const delBtn = document.createElement("button");
      delBtn.textContent = "🗑️";
      delBtn.title = "Delete note";
      delBtn.className = "icon";
      del.appendChild(delBtn);

      attachDeleteHandler(delBtn, login, notes, (updated) => {
        render(updated);
      });
    });
}
