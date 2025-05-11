const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const SELECTORS = {
    'homepage_recommended': 'a[data-a-target="preview-card-image-link"]',
    'homepage_noteTooltip': 'style#tw-notes-style',
    'homepage_noteHooked': '[data-note-hooked]',
    'chat_username': '[data-a-user]',
    'chat_noteTooltip': 'style#tw-notes-style',
    'chat_noteHooked': '[data-note-hooked]',
  };

  const results = {};
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Step 1: Visit homepage and collect selectors
    await page.goto('https://www.twitch.tv');
    await page.waitForTimeout(5000);

    // Get first recommended channel href
    const firstLiveHref = await page
      .locator('a[data-a-target="preview-card-image-link"]')
      .first()
      .getAttribute('href');

    const liveChannelURL = firstLiveHref
      ? `https://www.twitch.tv${firstLiveHref}`
      : null;

    for (const [key, selector] of Object.entries(SELECTORS)) {
      if (key.startsWith('homepage_')) {
        const count = await page.locator(selector).count();
        results[key] = count;
      }
    }

    // Step 2: Visit a live channel and collect chat selectors
    if (liveChannelURL) {
      await page.goto(liveChannelURL);
      await page.waitForTimeout(8000);

      for (const [key, selector] of Object.entries(SELECTORS)) {
        if (key.startsWith('chat_')) {
          const count = await page.locator(selector).count();
          results[key] = count;
        }
      }
    } else {
      console.warn('⚠️ No live channel found to run chat selector tests.');
    }

    const outputPath = path.resolve(__dirname, 'last-smoketest.json');
    let previous = {};
    if (fs.existsSync(outputPath)) {
      previous = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
    }

    const deltas = {};
    let failure = false;
    for (const key in results) {
      const prev = previous[key] || 0;
      const curr = results[key];
      deltas[key] = curr - prev;
      if (curr < prev) failure = true;
    }

    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));

    console.log('Selector match results:', results);
    console.log('Change from last run:', deltas);

    if (failure) {
      const alertPath = path.resolve(__dirname, 'alert.md');
      const alertContent = [
        '### Selector Drop Detected',
        '',
        'One or more selectors have fewer matches than last run.',
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

      console.error('❌ One or more selector match counts decreased. Investigate Twitch DOM changes.');
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
