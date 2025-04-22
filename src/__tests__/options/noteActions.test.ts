import { describe, it, beforeEach, expect, vi } from "vitest";
import {
  attachEditHandler,
  attachDeleteHandler,
} from "../../options/noteActions";
import type { NotesMap } from "../../types";

describe("noteActions", () => {
  let notes: NotesMap;
  let onChange: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    document.body.innerHTML =
      "<table><tbody><tr><td></td><td></td></tr></tbody></table>";
    localStorage.clear();
    vi.restoreAllMocks();

    notes = {
      testuser: {
        note: "original note",
        update_date: "2024-01-01T00:00:00.000Z",
      },
    };

    onChange = vi.fn();
  });

  it("allows editing and saving a note", async () => {
    const td = document.querySelectorAll("td")[0] as HTMLTableCellElement;
    attachEditHandler(td, "testuser", notes, onChange);

    const textarea = td.querySelector("textarea")!;
    const saveBtn = td.querySelector("button")!;
    textarea.value = "updated note";

    const setItemSpy = vi.spyOn(localStorage.__proto__, "setItem");

    await saveBtn.click();

    expect(notes.testuser.note).toBe("updated note");
    expect(onChange).toHaveBeenCalled();
    expect(setItemSpy).toHaveBeenCalledWith(
      "notes",
      expect.stringContaining("updated note"),
    );
  });

  it("calls onChange on cancel", () => {
    const td = document.querySelectorAll("td")[0] as HTMLTableCellElement;
    attachEditHandler(td, "testuser", notes, onChange);

    const cancelBtn = td.querySelectorAll("button")[1];
    cancelBtn.click();

    expect(onChange).toHaveBeenCalledWith(notes);
  });

  it("deletes a note after confirmation", async () => {
    const delBtn = document.createElement("button");
    document.body.appendChild(delBtn);

    attachDeleteHandler(delBtn, "testuser", notes, onChange);

    const setItemSpy = vi.spyOn(localStorage.__proto__, "setItem");
    global.confirm = vi.fn(() => true);

    await delBtn.click();

    expect(notes.testuser).toBeUndefined();
    expect(setItemSpy).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalled();
  });

  it("does not delete if cancelled", async () => {
    const delBtn = document.createElement("button");
    document.body.appendChild(delBtn);

    attachDeleteHandler(delBtn, "testuser", notes, onChange);

    global.confirm = vi.fn(() => false);

    await delBtn.click();

    expect(notes.testuser).toBeDefined();
    expect(onChange).not.toHaveBeenCalled();
  });
});
