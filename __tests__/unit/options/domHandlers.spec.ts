import { describe, it, expect, vi } from "vitest";
import { bindExportBtn, bindImportBtn } from "@src/options/domHandlers";
import type { IStorageProvider, NotesMap } from "@src/types";

describe("domHandlers.ts", () => {
  const notes: NotesMap = {
    user1: { note: "hello", update_date: "2024-01-01" },
  };

  it("triggers download on export click", () => {
    const btn = document.createElement("button");
    document.body.appendChild(btn);

    const clickSpy = vi.fn();

    global.URL.createObjectURL = vi.fn(() => "blob:mock");

    const realCreateElement = document.createElement.bind(document);
    vi.spyOn(document, "createElement").mockImplementation((tag) => {
      const el = realCreateElement(tag);
      if (tag === "a") el.click = clickSpy;
      return el;
    });

    bindExportBtn(btn, notes);
    btn.click();

    expect(clickSpy).toHaveBeenCalled();
  });

  it("calls onRender when file is valid", async () => {
    const json = JSON.stringify(notes);
    const file = new File([json], "import.json", { type: "application/json" });
    File.prototype.text = vi.fn().mockResolvedValue(json);
    const input = document.createElement("input");
    Object.defineProperty(input, "files", { value: [file] });

    const storage: IStorageProvider = {
      get: vi.fn(),
      set: vi.fn().mockResolvedValue({}),
      getBytesUsed: vi.fn(),
    };

    const onRender = vi.fn();
    const onError = vi.fn();
    const summary = document.createElement("div");

    bindImportBtn(input, storage, onRender, onError, summary);
    input.dispatchEvent(new Event("change"));
    await new Promise((r) => setTimeout(r, 0));

    expect(onRender).toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });
});
