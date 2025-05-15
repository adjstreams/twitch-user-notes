import { test, expect } from "@playwright/test";

const chromeShim = `
globalThis.chrome = {
  storage: {
    local: {
      get: (keys, callback) => {
        const result = {
          notes: {
            testuser: {
              note: "Mocked note",
              update_date: new Date().toISOString()
            }
          }
        };
        callback(result);
      },
      set: (_items, callback) => {
        if (typeof callback === "function") callback();
      },
      getBytesInUse: (_key, callback) => {
        if (typeof callback === "function") callback(123);
      }
    }
  },
  runtime: {
    sendMessage: () => {},
    onMessage: {
      addListener: () => {}
    }
  }
};
`;

test.describe("Options Page E2E with inline chrome shim", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ content: chromeShim });
    await page.goto("http://localhost:4173/options/options.html");
  });

  test("renders mocked note", async ({ page }) => {
    const cell = await page.locator("td").first();
    await expect(cell).toContainText("testuser");
  });

  test("can click edit and save", async ({ page }) => {
    await page.click("text=✏️");
    await page.locator("textarea").fill("E2E updated");
    await page.click("text=💾");

    const noteCell = await page.locator("tbody tr td:nth-child(2)");
    await expect(noteCell).toContainText("E2E updated");
  });

  test("can delete the row", async ({ page }) => {
    const rows = page.locator("tbody tr");

    page.once("dialog", async (dialog) => {
      expect(dialog.type()).toBe("confirm");
      await dialog.accept();
    });

    await page.click("text=🗑️");
    await expect(rows).toHaveCount(0);
  });
});
