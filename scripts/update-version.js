import fs from 'fs';

const version = process.argv[2];

if (!version) {
  console.error("Missing version argument");
  process.exit(1);
}

const updateJsonVersion = (filePath) => {
  if (!fs.existsSync(filePath)) return;
  const json = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  json.version = version;
  fs.writeFileSync(filePath, JSON.stringify(json, null, 2));
  console.log(`Updated ${filePath} to version ${version}`);
};

updateJsonVersion('./package.json');
updateJsonVersion('./public/manifest.json');
// Update the dist/manifest.json to keep it in sync with the public/manifest.json
updateJsonVersion('./dist/manifest.json'); 
