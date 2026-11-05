const fs = require('node:fs');
const path = require('node:path');
const { parseArgs } = require('node:util');

function generateRuntimeCatalog(localeDirectory, outputPath) {
  const messages = { en: JSON.parse(fs.readFileSync(path.join(localeDirectory, 'translations.json'), 'utf8')) };

  for (const filename of fs.readdirSync(localeDirectory).sort()) {
    if (filename.endsWith('.json') && !['translations.json', 'data.json'].includes(filename)) {
      messages[path.basename(filename, '.json')] = JSON.parse(fs.readFileSync(path.join(localeDirectory, filename), 'utf8'));
    }
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(messages, null, 2)}\n`);
}

if (require.main === module) {
  const localeDirectory = path.resolve(__dirname, '../../locales');
  const { values } = parseArgs({ options: { 'out-file': { type: 'string', default: path.join(__dirname, 'src/generated/data.json') } } });
  generateRuntimeCatalog(localeDirectory, values['out-file']);
}

module.exports = generateRuntimeCatalog;
