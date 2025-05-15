import { describe, it, vi, expect, beforeEach, afterEach } from "vitest";
import { MockChrome } from "../testUtils";

// Minimal mock chrome types
type MockContextMenuInfo = { menuItemId: string };
type MockTab = { id: number };
type MockMessage = { type: "CTX_TARGET" | "CTX_CLEAR"; login?: string };

type OnClickedCallback = (info: MockContextMenuInfo, tab: MockTab) => void;
type OnMessageCallback = (msg: MockMessage) => void;

let onClickedCallback: OnClickedCallback;
let onMessageCallback: OnMessageCallback;
let updateSpy: ReturnType<typeof vi.fn>;
let createSpy: ReturnType<typeof vi.fn>;
let sendMessageSpy: ReturnType<typeof vi.fn>;

beforeEach(() => {
  updateSpy = vi.fn((_id, _props, cb) => cb?.());
  createSpy = vi.fn();
  sendMessageSpy = vi.fn();
  onClickedCallback = () => {};
  onMessageCallback = () => {};

  (globalThis as unknown as { chrome: MockChrome }).chrome = {
    runtime: {
      onInstalled: { addListener: vi.fn() },
      onMessage: {
        addListener: vi.fn((cb) => {
          onMessageCallback = cb;
        }),
      },
      lastError: undefined,
    },
    contextMenus: {
      update: updateSpy,
      create: createSpy,
      onClicked: {
        addListener: vi.fn((cb) => {
          onClickedCallback = cb;
        }),
      },
    },
    tabs: {
      sendMessage: sendMessageSpy,
    },
  };

  vi.stubGlobal("chrome", chrome);

  vi.resetModules(); // Reset all module state before each test
});

afterEach(() => {
  chrome.runtime!.lastError = undefined;
});

describe("background.ts", () => {
  it("creates context menu if update fails", async () => {
    updateSpy.mockImplementationOnce((_id, _props, cb) => {
      chrome.runtime!.lastError = { message: "mock error" };
      cb?.();
    });

    await import("@src/background/background");
    expect(createSpy).toHaveBeenCalled();
  });

  it("sends PROMPT_NOTE when context menu clicked", async () => {
    await import("@src/background/background");
    onMessageCallback({ type: "CTX_TARGET", login: "bob" });
    onClickedCallback({ menuItemId: "tw-edit-note" }, { id: 42 });

    expect(sendMessageSpy).toHaveBeenCalledWith(42, {
      type: "PROMPT_NOTE",
      login: "bob",
    });
  });

  it("hides context menu on CTX_CLEAR", async () => {
    await import("@src/background/background");
    onMessageCallback({ type: "CTX_CLEAR" });

    expect(updateSpy).toHaveBeenCalledWith(
      "tw-edit-note",
      { visible: false },
      expect.any(Function),
    );
  });

  it("shows context menu with login on CTX_TARGET", async () => {
    await import("@src/background/background");
    onMessageCallback({ type: "CTX_TARGET", login: "alice" });

    expect(updateSpy).toHaveBeenCalledWith(
      "tw-edit-note",
      expect.objectContaining({
        title: expect.stringContaining("alice"),
        visible: true,
      }),
      expect.any(Function),
    );
  });
});
