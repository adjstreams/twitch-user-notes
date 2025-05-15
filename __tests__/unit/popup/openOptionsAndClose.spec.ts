import { describe, it, expect, vi } from "vitest";
import type { MockChrome } from "../testUtils";
import { openOptionsAndClose } from "@src/popup/openOptionsAndClose";

describe("popup logic", () => {
  it("calls openOptionsPage and closes the window", () => {
    const openOptionsPage = vi.fn();
    const close = vi.fn();

    (globalThis as unknown as { chrome: MockChrome }).chrome = {
      runtime: { openOptionsPage },
    };
    vi.stubGlobal("close", close);

    openOptionsAndClose();

    expect(openOptionsPage).toHaveBeenCalled();
    expect(close).toHaveBeenCalled();
  });
});
