# Contributing to Twitch User Notes

Thanks for considering contributing to **Twitch User Notes**! 🎉

Whether you're here to report a bug, suggest a feature, or submit a pull request, you're helping make this Chrome extension better for everyone — and that means a lot.

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

3. **Run tests and linter**

   ```bash
   npm run lint
   npm run test
   ```

4. **Build the extension**

   ```bash
   npm run build
   ```

   This will output a `/dist` folder ready to be loaded into Chrome.

---

## 👾 Code Guidelines

- Write clean, readable, and type-safe TypeScript.
- Follow the existing formatting and use `eslint` to catch issues.
- All UI logic should be testable or easily mockable using JSDOM.
- Use `vitest` for unit testing.
- Use conventional commits (e.g., `feat:`, `fix:`, `chore:`).

---

## 🔍 Want to Help but Not Sure How?

Here are some ideas!

- Improve test coverage
- Add Playwright tests for real Twitch interactions
- Support Firefox / other Chromium browsers
- Improve UI/UX (Options page)
- Add syncing or export/import features
- Submit a Twitch-themed icon or branding

---

## 🧠 Questions or Support?

- Say hi at [adj.gg](https://adj.gg)
- Twitch dev streams: [twitch.tv/adjcodes](https://twitch.tv/adjcodes)
- Streaming variety: [twitch.tv/adjstreams](https://twitch.tv/adjstreams)
- Project site: [streamgood.gg](https://streamgood.gg)

---

Thanks again! 🙌