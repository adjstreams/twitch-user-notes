import type { NotesMap, UserNote } from "../types";

export function isValidNotesMap(obj: unknown): obj is NotesMap {
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

/**
 * Updates the DOM with storage usage statistics and a visual usage bar.
 *
 * @param notes - The current NotesMap to count entries
 * @param el - The container element with #storage-bar-fill and #storage-bar-text children
 */
export async function showStorageUsage(
  notes: NotesMap,
  el: HTMLElement | null,
) {
  if (!el) return;

  try {
    const bytesUsed = await chrome.storage.local.getBytesInUse("notes");
    const maxBytes = 5 * 1024 * 1024;
    const percent = ((bytesUsed / maxBytes) * 100).toFixed(2);
    const usedKB = (bytesUsed / 1024).toFixed(1);
    const noteCount = Object.keys(notes).length;

    const fill = el.querySelector("#storage-bar-fill") as HTMLElement | null;
    const text = el.querySelector("#storage-bar-text") as HTMLElement | null;

    if (fill) fill.style.width = `${percent}%`;
    if (text) {
      text.textContent = `Using ${usedKB} KB (${percent}%) — ${noteCount} note${noteCount !== 1 ? "s" : ""}`;
    }
  } catch (err) {
    el.textContent = "Unable to retrieve storage usage.";
    console.log(err);
  }
}
