import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { USERNAME_SELECTORS } from '../../src/selectors.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

(async () => {
  const SELECTORS = {
    homepage: [...USERNAME_SELECTORS],
    chat: [...USERNAME_SELECTORS]
  };

  const results = { homepage: {}, chat: {} };
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Step 1: Homepage expanded
    await page.goto('https://www.twitch.tv');
    await page.waitForTimeout(5000);

    const homepageResults = {};
    for (const selector of SELECTORS.homepage) {
      const count = await page.locator(selector).count();
      homepageResults[selector] = count > 0;
    }

    // Step 2: Collapse nav if toggle exists and test again
    const collapseButton = page.locator('[data-a-target="side-nav-arrow"]');
    if (await collapseButton.count()) {
      await collapseButton.click();
      await page.waitForTimeout(1000);

      for (const selector of SELECTORS.homepage) {
        const count = await page.locator(selector).count();
        homepageResults[selector] ||= count > 0;
      }
    }

    results.homepage = homepageResults;

    // Step 3: Capture live channel for chat screen test
    const firstLiveHref = await page
      .locator('a[data-a-target="preview-card-image-link"]')
      .first()
      .getAttribute('href');
    const liveChannelURL = firstLiveHref ? `https://www.twitch.tv${firstLiveHref}` : null;

    if (liveChannelURL) {
      await page.goto(liveChannelURL);
      await page.waitForTimeout(8000);

      for (const selector of SELECTORS.chat) {
        const count = await page.locator(selector).count();
        results.chat[selector] = count > 0;
      }
    } else {
      console.warn('⚠️ No live channel found to run chat selector tests.');
    }

    const outputPath = path.resolve(__dirname, 'last-smoketest.json');

    if (!fs.existsSync(outputPath)) {
      console.log('🟡 No baseline found. Writing initial result and exiting.');
      fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
      process.exit(0);
    }

    const previous = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
    const deltas = { homepage: {}, chat: {} };
    let failure = false;

    for (const contextKey of Object.keys(results)) {
      for (const selector of Object.keys(results[contextKey])) {
        const prev = previous[contextKey]?.[selector] ?? true;
        const curr = results[contextKey][selector];
        deltas[contextKey][selector] = `${prev} → ${curr}`;
        if (prev === true && curr === false) failure = true;
      }
    }

    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));

    console.log('Selector match results:', results);
    console.log('Change from last run:', deltas);

    if (failure) {
      const alertPath = path.resolve(__dirname, 'alert.md');
      const alertContent = [
        '### Selector Drop Detected',
        '',
        'One or more selectors that previously matched now return no results.',
        '',
        '**Current Results:**',
        '```json',
        JSON.stringify(results, null, 2),
        '```',
        '',
        '**Deltas:**',
        '```json',
        JSON.stringify(deltas, null, 2),
        '```'
      ].join('\n');

      fs.writeFileSync(alertPath, alertContent);
      console.error('❌ At least one selector dropped from true to false. Investigate Twitch DOM changes.');
      process.exit(1);
    } else {
      console.log('✅ Selector check passed.');
    }
  } catch (err) {
    console.error('⚠️ Smoketest failed to run:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
