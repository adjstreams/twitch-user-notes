import { storage as defaultStorage } from "../storage/defaultStorage";
import { renderNotesTable } from "./options";
import { loadNotes } from "./notesStorage";
import { bindExportBtn, bindImportBtn } from "./domHandlers";
import { showStorageUsage } from "./notesUtils";

export async function initApp(): Promise<void> {
  const notes = await loadNotes(defaultStorage);
  renderNotesTable(notes, defaultStorage);

  const exportBtn = document.getElementById("export");
  const importInput = document.getElementById(
    "import-file",
  ) as HTMLInputElement;
  const summaryEl = document.getElementById("storage-usage");

  if (exportBtn) {
    bindExportBtn(exportBtn, notes);
  }

  if (importInput) {
    bindImportBtn(
      importInput,
      defaultStorage,
      (updated) => {
        renderNotesTable(updated, defaultStorage);
        showStorageUsage(updated, summaryEl);
      },
      alert,
      summaryEl,
    );
  }

  showStorageUsage(notes, summaryEl);

  const importBtn = document.getElementById("import");
  if (importBtn && importInput) {
    importBtn.addEventListener("click", () => {
      importInput.value = "";
      importInput.click();
    });
  }

  const sortSelect = document.getElementById(
    "sort",
  ) as HTMLSelectElement | null;
  if (sortSelect) {
    sortSelect.addEventListener("change", () => {
      renderNotesTable(notes, defaultStorage);
    });
  }

  const clearBtn = document.getElementById("clear");
  if (clearBtn) {
    clearBtn.addEventListener("click", async () => {
      if (confirm("Are you sure you want to delete all notes?")) {
        await defaultStorage.set({});
        renderNotesTable({}, defaultStorage);
        showStorageUsage({}, summaryEl);
      }
    });
  }
}
