---
nav_order: 6
title: Selectors
---

# Selector System Overview

This document explains how user-related DOM selectors are managed, structured, and tested within the project.

---

## 📦 `selectorMetadata.ts`: The Source of Truth

All selectors are defined in `selectorMetadata.ts`. Each selector has:

- `selector`: A CSS selector string
- `contexts`: One or more pages it appears on
- `description` _(optional)_: Clarifies purpose
- `smoketest` _(optional, default = true)_: If false, the selector is excluded from CI smoketests

Example:
```ts
{
  selector: '.channel-root--watch h1.tw-title',
  contexts: ['channelWatch'],
  description: 'Live stream view title',
}
```

---

## 🧠 Context Definitions

| Context           | Meaning                                                  |
|-------------------|----------------------------------------------------------|
| `homepage`        | Twitch front page after load                             |
| `sidebarCollapsed`| Same as `homepage`, but nav is collapsed                 |
| `channelWatch`    | The initial landing page when clicking a live stream     |
| `channelHome`     | The full profile view after clicking the channel name    |

---

## ⚙️ `selectors.ts`: Auto-Generated for Extension Use

This file flattens and deduplicates all selectors across all contexts:

```ts
export const USERNAME_SELECTORS = Array.from(
  new Set(SELECTOR_METADATA.map(meta => meta.selector))
);
```

Used by the extension’s content script for note display and interaction.

---

## 🧪 `selector-check.ts`: Context-Aware Smoketests

This script performs a CI smoketest that:

1. Visits each relevant Twitch context
2. Runs only the selectors assigned to that context
3. Compares results to `last-smoketest.json`
4. Fails CI if any selector previously `true` is now `false`

Smoketests automatically skip any selector marked `smoketest: false`.

---

## ➕ How to Add a New Selector

1. Add a new object to `selectorMetadata.ts`
2. Assign appropriate `contexts`
3. Optionally provide a `description` and `smoketest: false` if it should be excluded from testing
4. No need to touch `selectors.ts` or the smoketest logic — it's all dynamic
5. Run `npm run smoketest` and review output

---

## 🔍 Debugging Tips

- You can run the smoketest manually with:
  ```sh
  npm run smoketest
  ```

- If a selector isn’t being found:
  - Open the live site in Chrome DevTools
  - Paste your selector in `document.querySelector(...)` to confirm
  - Consider adding `scrollIntoViewIfNeeded()` or waiting for delayed DOM load

---
