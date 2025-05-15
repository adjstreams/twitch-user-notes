import { describe, it, vi, beforeEach, expect } from "vitest";
import {
  attachEditHandler,
  attachDeleteHandler,
} from "@src/options/noteInteractionHandlers";
import { MockStorageProvider } from "@tests/unit/__mocks__/mockStorage";
import type { NotesMap } from "@src/types";

describe("noteActions.ts", () => {
  let storage: MockStorageProvider;
  let notes: NotesMap;
  let td: HTMLTableCellElement;
  let onChange: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // DOM reset
    document.body.innerHTML =
      "<table><tbody><tr><td></td></tr></tbody></table>";
    td = document.querySelector("td")!;
    onChange = vi.fn();

    notes = {
      testuser: { note: "original", update_date: "2024-01-01" },
    };

    storage = new MockStorageProvider(JSON.parse(JSON.stringify(notes)));
  });

  it("should render textarea and save/cancel buttons when editing", () => {
    attachEditHandler(td, "testuser", notes, onChange, storage);

    expect(td.querySelector("textarea")).toBeTruthy();
    expect(td.querySelector("button[title='Save note']")).toBeTruthy();
    expect(td.querySelector("button[title='Cancel']")).toBeTruthy();
  });

  it("should save edited note and call onChange", async () => {
    attachEditHandler(td, "testuser", notes, onChange, storage);

    const textarea = td.querySelector("textarea")!;
    const saveBtn = td.querySelector("button[title='Save note']")!;

    textarea.value = "updated note";
    await saveBtn.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    const updatedNotes = await storage.get();
    expect(updatedNotes.testuser.note).toBe("updated note");
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        testuser: expect.objectContaining({ note: "updated note" }),
      }),
    );
  });

  it("should call onChange without saving on cancel", () => {
    attachEditHandler(td, "testuser", notes, onChange, storage);

    const cancelBtn = td.querySelector("button[title='Cancel']")!;
    cancelBtn.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(onChange).toHaveBeenCalledWith(notes);
  });

  it("should delete note and call onChange when confirmed", async () => {
    const delBtn = document.createElement("button");
    document.body.appendChild(delBtn);

    vi.stubGlobal(
      "confirm",
      vi.fn(() => true),
    ); // simulate confirmation

    attachDeleteHandler(delBtn, "testuser", notes, onChange, storage);

    await delBtn.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    const updatedNotes = await storage.get();
    expect(updatedNotes.testuser).toBeUndefined();
    expect(onChange).toHaveBeenCalledWith({});
  });

  it("should not delete note if confirmation is cancelled", async () => {
    const delBtn = document.createElement("button");
    document.body.appendChild(delBtn);

    vi.stubGlobal(
      "confirm",
      vi.fn(() => false),
    ); // simulate cancel

    attachDeleteHandler(delBtn, "testuser", notes, onChange, storage);

    await delBtn.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    const updatedNotes = await storage.get();
    expect(updatedNotes.testuser).toBeDefined();
    expect(onChange).not.toHaveBeenCalled();
  });
});
