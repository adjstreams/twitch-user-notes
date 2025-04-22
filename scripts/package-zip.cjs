const { execSync } = require("child_process");
const version = process.argv[2];

if (!version) {
  console.error("❌ Missing version number");
  process.exit(1);
}

console.log(`📦 Zipping extension for version ${version}...`);

execSync(`cd dist && zip -r ../twitch-user-notes-v${version}.zip *`, {
  stdio: "inherit"
});
