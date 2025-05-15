import { test, expect, chromium, BrowserContext } from "@playwright/test";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const EXTENSION_PATH = path.join(__dirname, "../../../dist");

test.describe("Twitch User Notes Extension", () => {
  let context: BrowserContext;

  const isCI = process.env.CI === "true";

  test.beforeAll(async () => {
    context = await chromium.launchPersistentContext("", {
      headless: isCI,
      args: [
        `--disable-extensions-except=${EXTENSION_PATH}`,
        `--load-extension=${EXTENSION_PATH}`,
      ],
    });
  });

  test.afterAll(async () => {
    if (context) {
      await context.close();
    }
  });

  test("should load Twitch and inject content script", async () => {
    const page = await context.newPage();
    await page.goto("https://www.twitch.tv");

    const styleCount = await page.locator("style#tw-notes-style").count();
    expect(styleCount).toBe(1);
  });

  test("should hook at least one username on Twitch", async () => {
    const page = await context.newPage();
    await page.goto("https://www.twitch.tv");

    await page.waitForTimeout(2000); // give chat/sidebar time to load

    const hooked = await page.locator("[data-note-hooked]").count();
    expect(hooked).toBeGreaterThan(0);
  });
});
