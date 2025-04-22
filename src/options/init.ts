// options/init.ts
import { storage } from "../storage";
import { render } from "./options";
import type { NotesMap, UserNote } from "../types";

let notes: NotesMap = {};

function isValidNotesMap(obj: unknown): obj is NotesMap {
  return (
    typeof obj === "object" &&
    obj !== null &&
    !Array.isArray(obj) &&
    Object.values(obj).every(
      (v): v is UserNote =>
        typeof v === "object" &&
        v !== null &&
        typeof (v as { note?: unknown }).note === "string" &&
        typeof (v as { update_date?: unknown }).update_date === "string",
    )
  );
}

export async function initApp(): Promise<void> {
  notes = await storage.getNotes();
  render(notes);
  showStorageUsage();
}

export function initDOMHandlers(): void {
  document.getElementById("export")?.addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(notes, null, 2)], {
      type: "application/json",
    });
    const a = Object.assign(document.createElement("a"), {
      href: URL.createObjectURL(blob),
      download: "twitch-notes.json",
    });
    a.click();
  });

  document.getElementById("import")?.addEventListener("click", () => {
    document.getElementById("import-file")?.click();
  });

  document
    .getElementById("import-file")
    ?.addEventListener("change", async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const txt = await file.text();
        const obj = JSON.parse(txt);
        if (!isValidNotesMap(obj)) throw new Error("Invalid schema");

        const replace = (document.getElementById("replace") as HTMLInputElement)
          .checked;
        notes = replace ? obj : { ...notes, ...obj };

        await storage.setNotes(notes);
        render(notes);
        showStorageUsage();
      } catch (err: unknown) {
        alert(
          "Import failed: " +
            (err instanceof Error ? err.message : String(err)),
        );
      }
    });

  document.getElementById("clear")?.addEventListener("click", async () => {
    if (confirm("Are you sure you want to clear all notes?")) {
      notes = {};
      await storage.setNotes(notes);
      render(notes);
      showStorageUsage();
    }
  });
}

async function showStorageUsage() {
  const bytes = await storage.getBytesUsed();
  const limit = 102_400;
  const percent = Math.round((bytes / limit) * 100);
  const div = document.getElementById("storage-usage");
  if (!div) return;

  let className = "storage-info";
  if (percent > 90) className += " danger";
  else if (percent > 75) className += " warning";

  div.className = className;
  div.innerHTML = `
    <strong>Storage Usage:</strong> ${bytes} / ${limit} bytes (${percent}%)<br>
    ${
      percent > 90
        ? "<strong>⚠️ Near sync limit!</strong> Export your notes to back them up or use local storage in the future."
        : "Tip: Export your notes to share or transfer between browsers."
    }
  `;
}
