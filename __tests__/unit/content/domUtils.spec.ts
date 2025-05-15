import { describe, it, expect, beforeEach } from "vitest";
import { extractLogin, showTooltip, hideTooltip } from "@src/content/domUtils";

beforeEach(() => {
  document.body.innerHTML = "";
});

describe("extractLogin", () => {
  it("gets login from textContent", () => {
    const el = document.createElement("div");
    el.textContent = "Streamer123";
    expect(extractLogin(el)).toBe("streamer123");
  });

  it("gets login from aria-label", () => {
    const el = document.createElement("a");
    el.setAttribute("aria-label", "streamerGame live now");
    expect(extractLogin(el)).toBe("streamergame");
  });

  it("gets login from href", () => {
    const el = document.createElement("a");
    el.setAttribute("href", "/someUser");
    expect(extractLogin(el)).toBe("someuser");
  });
});

describe("tooltip functions", () => {
  it("creates a tooltip element", () => {
    const event = { clientX: 10, clientY: 10 } as MouseEvent;
    showTooltip(event, "Test note");
    const tooltip = document.querySelector(".note-tooltip");
    expect(tooltip).toBeTruthy();
    expect(tooltip?.textContent).toBe("Test note");
  });

  it("removes tooltip element", () => {
    const event = { clientX: 10, clientY: 10 } as MouseEvent;
    showTooltip(event, "To be removed");
    hideTooltip();
    const tooltip = document.querySelector(".note-tooltip");
    expect(tooltip).toBeNull();
  });
});
