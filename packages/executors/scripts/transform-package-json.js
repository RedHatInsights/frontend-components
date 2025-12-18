const fs = require('fs');
const path = require('path');
const { transformPackageJsonForPublishing } = require('../dist/executors/builder/executor');

// Paths relative to project root
const sourcePackageJsonPath = path.resolve(__dirname, '../package.json');
const distPackageJsonPath = path.resolve(__dirname, '../dist/package.json');

try {
  // Read source package.json
  const sourcePackageJson = JSON.parse(fs.readFileSync(sourcePackageJsonPath, 'utf-8'));

  // Transform it
  const transformedPackageJson = transformPackageJsonForPublishing(sourcePackageJson);

  // Write to dist folder
  fs.writeFileSync(distPackageJsonPath, JSON.stringify(transformedPackageJson, null, 2));

  console.log('✓ Successfully transformed package.json for publishing');
} catch (error) {
  console.error('✗ Failed to transform package.json:', error.message);
  process.exit(1);
}
