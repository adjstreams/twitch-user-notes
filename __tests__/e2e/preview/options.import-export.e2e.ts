import { test, expect } from "@playwright/test";
import { Buffer } from "buffer";

// Shim chrome APIs for testing
const chromeShim = `
globalThis.chrome = {
  storage: {
    local: {
      get: (keys, callback) => {
        const result = { notes: {
          testuser: {
            note: "existing",
            update_date: new Date().toISOString()
          }
        }};
        callback(result);
      },
      set: (_items, callback) => callback?.(),
      getBytesInUse: (_key, callback) => callback?.(512)
    }
  },
  runtime: {
    sendMessage: () => {},
    onMessage: { addListener: () => {} }
  }
};
`;

declare global {
  interface Window {
    _lastExportBlob?: Blob;
  }
}

test.describe("Options Page Import/Export", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ content: chromeShim });
    await page.goto("http://localhost:4173/options/options.html");
  });

  test("triggers download on export click", async ({ page }) => {
    const createObjectURL = await page.evaluateHandle(() => {
      const original = URL.createObjectURL;
      URL.createObjectURL = (blob: Blob) => {
        window._lastExportBlob = blob;
        return "blob:mock";
      };
      return original;
    });

    await page.click("text=Export");

    const blobContent = await page.evaluate(() =>
      new Response(window._lastExportBlob).text(),
    );
    const exported = JSON.parse(blobContent);
    expect(exported.testuser.note).toBe("existing");

    await page.evaluate(
      (orig) => (URL.createObjectURL = orig),
      createObjectURL,
    );
  });

  test("can import valid JSON and display new note", async ({ page }) => {
    const newNote = {
      newuser: { note: "imported note", update_date: new Date().toISOString() },
    };

    await page.setInputFiles("input#import-file", {
      name: "notes.json",
      mimeType: "application/json",
      buffer: Buffer.from(JSON.stringify(newNote), "utf-8"),
    });

    const cell = await page.locator("td").first();
    await expect(cell).toContainText("newuser");
  });

  test("alerts user on invalid JSON import", async ({ page }) => {
    const dialogPromise = page.waitForEvent("dialog");

    await Promise.all([
      dialogPromise.then(async (dialog) => {
        expect(dialog.message()).toContain("Failed to parse file.");
        await dialog.dismiss();
      }),
      page.setInputFiles("input#import-file", {
        name: "bad.json",
        mimeType: "application/json",
        buffer: Buffer.from("invalid json", "utf-8"),
      }),
    ]);
  });
});
