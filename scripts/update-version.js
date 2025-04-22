import fs from 'fs';

const version = process.argv[2];

// Update manifest.json
const manifestPath = './public/manifest.json';
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
manifest.version = version;
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

// Update package.json
const packagePath = './package.json';
const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
pkg.version = version;
fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2));

console.log(`Updated manifest.json and package.json to version ${version}`);
