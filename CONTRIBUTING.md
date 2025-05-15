
# Contributing to Twitch User Notes

Thanks for considering contributing to **Twitch User Notes**! 🎉

Whether you're here to report a bug, suggest a feature, or submit a pull request, you're helping make this Chrome extension better — and that means a lot.

---

## 🛠 Development Setup

1. **Clone the repo**

   ```bash
   git clone https://github.com/adjstreams/twitch-user-notes.git
   cd twitch-user-notes
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Check code quality**

   ```bash
   npm run lint            # Lints all code
   npm run test            # Runs unit tests via Vitest
   npm run test:coverage   # Show coverage summary
   ```

4. **Run full test suite (optional)**

   ```bash
   npm run e2e             # End-to-end test with Playwright (local only)
   ```

5. **Build the extension**

   ```bash
   npm run build
   ```

   This outputs the `/dist` folder.

   To load it in Chrome:
   1. Open `chrome://extensions`
   2. Enable **Developer mode** (top-right toggle)
   3. Click **Load unpacked**
   4. Select the `dist/` folder

6. **Commit using Commitizen**

   Use the interactive helper to generate commit messages in line with the Conventional Commits spec:

   ```bash
   npm run commit
   ```

---

## 👾 Code Guidelines

- Use clean, readable, and type-safe TypeScript.
- Ensure all new logic is testable or mockable.
- Stick to formatting via `npm run lint`.
- Write unit tests with `vitest`.
- Use `npm run commit` to follow the Conventional Commit format (`feat:`, `fix:`, `chore:`, etc).

---

## 💡 Where to Contribute

Here are a few ways you can help:

### 🔍 Testing & QA
- Increase unit test coverage
- Add or improve Playwright tests
- Run/debug selector smoketests (`npm run smoketest`)

### 🧰 Developer Experience
- Fix or upgrade build/dev tooling
- Improve CI workflows or GitHub Actions
- Support Firefox or alternative Chromium browsers

### 🎨 UX & Functionality
- Improve the Options UI layout or styling
- Add note categories, filters, or search
- Optimize injection speed or tooltip styling

### 📚 Documentation & Meta
- Update or improve documentation
- Fix outdated paths or instructions
- Help write FAQs or usage guides

---

## 🧪 Advanced Testing (Optional)

### Selector Drift Smoketest

This project includes a Playwright smoketest that runs nightly on CI to detect when Twitch changes their UI:

```bash
npm run smoketest
```

Use this if you're updating `selectors.ts` or suspect the DOM has changed. To debug it visually:

```bash
HEADLESS=false npm run smoketest
```

---

## 🧠 Questions or Support?

- Website: [adj.gg](https://adj.gg)
- Twitch Dev Streams: [twitch.tv/adjcodes](https://twitch.tv/adjcodes)
- Horror Streams: [twitch.tv/adjstreams](https://twitch.tv/adjstreams)
- Tools & Projects: [streamgood.gg](https://streamgood.gg)

---

Thanks again! 🙌
