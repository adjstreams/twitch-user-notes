---
nav_order: 7
title: Releasing
---

# Releasing a New Version

This project uses [`semantic-release`](https://semantic-release.gitbook.io/) to fully automate releases — including versioning, zip packaging, Git commits, and GitHub Releases.

There are no manual steps needed.

---

## ✅ What Happens on Release

When you push or merge into `main` with [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) (e.g., `feat:`, `fix:`), the following steps are triggered via GitHub Actions:

1. **Version Analysis**
   - Determines the next semantic version from commit history

2. **File Updates**
   - Runs:
     ```bash
     node scripts/update-version.js <version>
     node scripts/package-zip.cjs <version>
     ```
   - This updates:
     - `package.json`
     - `public/manifest.json`
     - Creates: `twitch-user-notes-v<version>.zip`

3. **Git Commit**
   - Commits the updated files with a release message:
     ```
     chore(release): 1.3.0 [skip ci]

     ### Features
     - Added XYZ...
     ```

4. **GitHub Release**
   - Tags the release (e.g. `v1.3.0`)
   - Publishes a GitHub Release with changelog and zip file

---

## 🔧 Plugins Used in `release.config.cjs`

| Plugin                        | Role |
|------------------------------|------|
| `@semantic-release/commit-analyzer`         | Reads commit messages to determine next version |
| `@semantic-release/release-notes-generator` | Generates changelog |
| `@semantic-release/exec`                    | Runs version and zip scripts |
| `@semantic-release/git`                     | Commits `package.json` and `manifest.json` with changelog |
| `@semantic-release/github`                  | Uploads zip to GitHub release as asset |

---

## 🧪 Example

Given a commit like:

```bash
git commit -m "feat: add user note editing from options screen"
```

When merged into `main`, the release pipeline will:

- Publish version `1.x.x` as needed
- Tag the commit
- Create a GitHub Release
- Attach `twitch-user-notes-v1.x.x.zip`

---

## 📦 Result

A fully automated pipeline with:

- Updated source files
- Tagged version history
- GitHub release page
- Web Store–ready `.zip` asset

---

You can always inspect or tweak this behavior via:
- `.github/workflows/release.yml`
- `release.config.cjs`
