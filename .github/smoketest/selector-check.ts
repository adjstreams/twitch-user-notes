import { chromium, Page } from "playwright";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import {
  SELECTOR_METADATA,
  SelectorContext,
} from "../../src/content/selectorMetadata.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BASELINE_PATH = path.resolve(__dirname, "last-smoketest.json");
const ALERT_PATH = path.resolve(__dirname, "alert.md");

interface SelectorResults {
  [selector: string]: boolean;
}

interface ResultsByContext {
  [context: string]: SelectorResults;
}

const CONTEXT_URLS: Record<SelectorContext, string> = {
  homepage: "https://www.twitch.tv",
  channelWatch: "",
  channelHome: "",
  sidebarCollapsed: "https://www.twitch.tv",
};

async function checkSelectors(
  page: Page,
  selectors: string[],
): Promise<SelectorResults> {
  const result: SelectorResults = {};
  for (const selector of selectors) {
    const locator = page.locator(selector);
    const count = await locator.count();
    result[selector] = count > 0;

    if (count > 0) {
      console.log(
        `✅ Selector matched: ${selector} (${count} element${count > 1 ? "s" : ""})`,
      );
      const el = locator.first();
      try {
        await el.scrollIntoViewIfNeeded();
        const text = await el.textContent();
        console.log(`→ Text content: ${text?.trim()}`);
      } catch {
        console.warn(
          `⚠️ Failed to inspect first element for selector: ${selector}`,
        );
      }
    } else {
      console.warn(`❌ Selector did not match: ${selector}`);
    }
  }
  return result;
}

function computeDeltas(
  prev: Partial<ResultsByContext>,
  curr: ResultsByContext,
) {
  const deltas: Record<string, Record<string, string>> = {};
  let failure = false;

  for (const context of Object.keys(curr)) {
    deltas[context] = {};
    for (const selector of Object.keys(curr[context])) {
      const previousValue = prev[context]?.[selector] ?? true;
      const currentValue = curr[context][selector];
      deltas[context][selector] = `${previousValue} → ${currentValue}`;
      if (previousValue === true && currentValue === false) failure = true;
    }
  }

  return { deltas, failure };
}

function writeJSON(filepath: string, data: unknown) {
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
}

function loadPreviousResults(filepath: string): Partial<ResultsByContext> {
  try {
    return JSON.parse(fs.readFileSync(filepath, "utf-8"));
  } catch {
    console.warn("🟡 No previous baseline found.");
    return {};
  }
}

function reportAndExit(
  results: ResultsByContext,
  deltas: Record<string, Record<string, string>>,
  failure: boolean,
) {
  writeJSON(BASELINE_PATH, results);
  console.log("✅ Selector match results:", results);
  console.log("🔍 Change from last run:", deltas);

  if (failure) {
    const alert = [
      "### Selector Drop Detected",
      "",
      "One or more selectors that previously matched now return no results.",
      "",
      "**Current Results:**",
      "```json",
      JSON.stringify(results, null, 2),
      "```",
      "",
      "**Deltas:**",
      "```json",
      JSON.stringify(deltas, null, 2),
      "```",
    ].join("\n");

    fs.writeFileSync(ALERT_PATH, alert);
    console.error("❌ Selector mismatch detected. See alert.md for details.");
    process.exit(1);
  } else {
    console.log("✅ All selectors passed baseline check.");
  }
}

async function run() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  const groupedSelectors: Record<SelectorContext, string[]> = {
    homepage: [],
    channelWatch: [],
    channelHome: [],
    sidebarCollapsed: [],
  };

  for (const meta of SELECTOR_METADATA) {
    if (meta.smoketest === false) continue;
    for (const ctx of meta.contexts) {
      groupedSelectors[ctx].push(meta.selector);
    }
  }

  const results: ResultsByContext = {
    homepage: {},
    channelWatch: {},
    channelHome: {},
    sidebarCollapsed: {},
  };

  try {
    // Homepage expanded
    await page.goto(CONTEXT_URLS.homepage);
    await page.waitForTimeout(5000);
    results.homepage = await checkSelectors(page, groupedSelectors.homepage);

    // Collapse nav for sidebarCollapsed context
    const collapse = page.locator('[data-a-target="side-nav-arrow"]');
    if (await collapse.count()) {
      await collapse.click();
      await page.waitForTimeout(1000);
      results.sidebarCollapsed = await checkSelectors(
        page,
        groupedSelectors.sidebarCollapsed,
      );
    } else {
      console.warn(
        "⚠️ Collapse toggle not found; skipping sidebarCollapsed test.",
      );
    }

    // Get a live channel URL
    const liveHref = await page
      .locator('a[data-a-target="preview-card-image-link"]')
      .first()
      .getAttribute("href");
    const liveURL = liveHref ? `https://www.twitch.tv${liveHref}` : null;

    if (liveURL) {
      CONTEXT_URLS.channelWatch = liveURL;
      CONTEXT_URLS.channelHome = liveURL;

      await page.goto(liveURL);
      await page.waitForSelector(".channel-root--watch h1.tw-title", {
        timeout: 30000,
      });
      const title = page.locator(".channel-root--watch h1.tw-title").first();
      await title.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);

      results.channelWatch = await checkSelectors(
        page,
        groupedSelectors.channelWatch,
      );

      const channelTitleLink = page
        .locator('a[href^="/"]:has(h1.tw-title)')
        .first();
      if (await channelTitleLink.count()) {
        await channelTitleLink.click();
        await page.waitForTimeout(3000);
        results.channelHome = await checkSelectors(
          page,
          groupedSelectors.channelHome,
        );
      } else {
        console.warn(
          "⚠️ Channel title link not found; skipping channelHome test.",
        );
      }
    } else {
      console.warn(
        "⚠️ No live channel found to test channelWatch/channelHome selectors.",
      );
    }

    const previous = loadPreviousResults(BASELINE_PATH);
    if (Object.keys(previous).length === 0) {
      console.log("🟡 No previous baseline. Saving current results.");
      writeJSON(BASELINE_PATH, results);
      return;
    }

    const { deltas, failure } = computeDeltas(previous, results);
    reportAndExit(results, deltas, failure);
  } catch (err) {
    console.error("⚠️ Smoketest error:", err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

run();
