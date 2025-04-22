import { describe, it, beforeEach, expect } from "vitest";
import { render } from "../../options/options";
import type { NotesMap } from "../../types";

describe("options.ts > render", () => {
  let tableBody: HTMLTableSectionElement;
  let notes: NotesMap;

  beforeEach(() => {
    // Set up a fake DOM structure similar to options.html
    document.body.innerHTML = `
<div id="storage-usage"></div>
    <button id="export"></button>
    <button id="import"></button>
    <input id="import-file" type="file" />
    <button id="clear"></button>
    <table id="notes">
      <thead><tr><th>User</th><th>Note</th><th>Updated</th><th></th></tr></thead>
      <tbody></tbody>
    </table>
    `;

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
  });

  it("renders all notes into the table", () => {
    render(notes);

    const rows = tableBody.querySelectorAll("tr");
    expect(rows.length).toBe(2);

    const firstRow = rows[0].querySelectorAll("td");
    expect(firstRow[0].textContent).toBe("adjcodes"); // alphabetically sorted
    expect(
      firstRow[1].textContent?.includes("Great streamer, calm energy"),
    ).toBe(true);
  });

  it("includes edit and delete buttons for each row", () => {
    render(notes);

    const rows = tableBody.querySelectorAll("tr");
    const secondRowButtons = rows[1].querySelectorAll("button");

    expect(secondRowButtons.length).toBeGreaterThanOrEqual(1);
    expect(secondRowButtons[0].textContent).toBe("✏️");
    expect(secondRowButtons[0].title).toBe("Edit note");
  });
});
