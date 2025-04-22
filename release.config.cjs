const fs = require("fs");
const { execSync } = require("child_process");

module.exports = {
  branches: ["main"],
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    [
      "@semantic-release/exec",
      {
        prepareCmd:
          "node scripts/update-version.js ${nextRelease.version} && node scripts/package-zip.js ${nextRelease.version}"
      }
    ],
    [
      "@semantic-release/git",
      {
        assets: ["package.json", "public/manifest.json"],
        message: "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}"
      }
    ],
    [
      "@semantic-release/github",
      {
        assets: ["twitch-user-notes-v*.zip"]
      }
    ]
  ]
};
