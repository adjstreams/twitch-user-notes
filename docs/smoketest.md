---
nav_order: 5
title: Selector Smoketest
---

# Smoketest: Selector Drift Detection

Twitch could change its UI. This extension uses a nightly smoketest to detect when selectors break — before users complain.

---

## 🛠 What It Tests

Each night, a GitHub Action opens:

1. **Twitch homepage**  
2. **A live channel's chat**

It checks whether expected Twitch DOM elements still exist — based on `src/selectors.ts`.

---

## ✅ How It Works

1. Playwright runs headless Chromium
2. Selectors are loaded from `USERNAME_SELECTORS`
3. Pages are visited and each selector is checked:
   - If it matched previously but now returns 0 → it is marked as dropped
4. A diff is generated between current and last baseline
5. If any selectors dropped from `true → false`, a GitHub Issue is opened

---

## 💾 Baseline Behavior

- The smoketest compares against `last-smoketest.json` from the `baselines` branch
- If the baseline is missing or empty, it skips alerting and saves the current snapshot

---

## 🔄 Updating the Baseline

If Twitch makes harmless UI changes and the extension still works:

1. **Run the smoketest manually** or let it run on schedule
2. If all selectors are still valid, the job will:
   - Upload a new `last-smoketest.json`
   - Push it to the `baselines` branch

You don't need to touch this manually unless the automation fails.

---

## 🧪 Running Locally

To debug selector issues:

```bash
HEADLESS=false npm run smoketest
```

This runs the smoketest visibly so you can inspect the DOM in a real browser window.

## 🔔 When You’ll Get Notified

If:

- A selector previously matched

- And now it doesn't

- Then a GitHub issue will be opened (with full JSON diff)

This helps catch Twitch UI updates before users do.