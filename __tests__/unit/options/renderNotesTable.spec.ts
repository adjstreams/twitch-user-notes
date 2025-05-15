import { describe, it, beforeEach, expect, vi } from "vitest";
import { renderNotesTable } from "@src/options/renderNotesTable";
import * as handlers from "@src/options/noteInteractionHandlers";
import { MockStorageProvider } from "@tests/unit/__mocks__/mockStorage";
import type { NotesMap } from "@src/types";

describe("renderNotesTable.ts", () => {
  let tableBody: HTMLTableSectionElement;
  let notes: NotesMap;
  let storage: MockStorageProvider;

  beforeEach(() => {
    vi.stubGlobal("confirm", vi.fn().mockReturnValue(true));
    document.body.innerHTML = `
      <select id="sort">
        <option value="date-desc">Recently updated</option>
        <option value="alpha">Username (A-Z)</option>
      </select>    
      <table id="notes">
        <thead><tr><th>User</th><th>Note</th><th>Updated</th><th></th></tr></thead>
        <tbody></tbody>
      </table>
    `;
    const sortSelect = document.getElementById("sort") as HTMLSelectElement;
    sortSelect.value = "alpha";
    tableBody = document.querySelector("#notes tbody")!;
    notes = {
      adjstreams: {
        note: "Chaotic adorable energy",
        update_date: "2023-10-03T08:20:00Z",
      },
      adjcodes: {
        note: "Great streamer, calm energy",
        update_date: "2023-10-01T12:34:56Z",
      },
    };
    storage = new MockStorageProvider({ ...notes });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders all notes into the table", () => {
    renderNotesTable(notes, storage);

    const rows = tableBody.querySelectorAll("tr");
    expect(rows.length).toBe(2);

    const firstRow = rows[0].querySelectorAll("td");
    expect(firstRow[0].textContent).toBe("adjcodes"); // alphabetically sorted
    expect(firstRow[1].textContent).toContain("Great streamer, calm energy");
  });

  it("includes edit and delete buttons for each row", () => {
    renderNotesTable(notes, storage);

    const rows = tableBody.querySelectorAll("tr");
    const firstRowButtons = rows[0].querySelectorAll("button");

    expect(firstRowButtons.length).toBeGreaterThanOrEqual(2);
    expect(firstRowButtons[0].textContent).toBe("✏️");
    expect(firstRowButtons[0].title).toBe("Edit note");
    expect(firstRowButtons[1].textContent).toBe("🗑️");
    expect(firstRowButtons[1].title).toBe("Delete note");
  });

  it("invokes edit handler when edit button is clicked", () => {
    const editSpy = vi.spyOn(handlers, "attachEditHandler");
    renderNotesTable(notes, storage);

    const editBtn = tableBody.querySelector("tr")?.querySelector("button");
    expect(editBtn).toBeTruthy();
    editBtn?.click();

    expect(editSpy).toHaveBeenCalledTimes(1);
    expect(editSpy.mock.calls[0][1]).toBe("adjcodes");
  });

  it("invokes delete handler when delete button is clicked", () => {
    const deleteSpy = vi.spyOn(handlers, "attachDeleteHandler");

    // Single-user setup
    const singleNote: NotesMap = {
      adjcodes: {
        note: "Great streamer, calm energy",
        update_date: "2023-10-01T12:34:56Z",
      },
    };

    renderNotesTable(singleNote, storage);

    const deleteBtn = tableBody
      .querySelector("tr")
      ?.querySelectorAll("button")[1];
    expect(deleteBtn).toBeTruthy();
    deleteBtn?.click();

    expect(deleteSpy).toHaveBeenCalledTimes(1);
    expect(deleteSpy.mock.calls[0][1]).toBe("adjcodes");
  });

  it("sorts by updated date when sortMode is 'date-desc'", () => {
    const sortSelect = document.getElementById("sort") as HTMLSelectElement;
    sortSelect.value = "date-desc";

    renderNotesTable(notes, storage);

    const rows = tableBody.querySelectorAll("tr");
    expect(rows.length).toBe(2);

    const firstRowUser = rows[0].querySelector("td")?.textContent;
    expect(firstRowUser).toBe("adjstreams"); // newer update_date
  });

  it("switches between sort modes correctly", () => {
    const sortSelect = document.getElementById("sort") as HTMLSelectElement;

    // First render with alpha
    sortSelect.value = "alpha";
    renderNotesTable(notes, storage);
    let firstRow = tableBody
      .querySelector("tr")
      ?.querySelector("td")?.textContent;
    expect(firstRow).toBe("adjcodes");

    // Then switch to date-desc
    sortSelect.value = "date-desc";
    renderNotesTable(notes, storage);
    firstRow = tableBody.querySelector("tr")?.querySelector("td")?.textContent;
    expect(firstRow).toBe("adjstreams");
  });

  it("renders nothing if notes map is empty", () => {
    renderNotesTable({}, storage);
    const rows = tableBody.querySelectorAll("tr");
    expect(rows.length).toBe(0);
  });
});
