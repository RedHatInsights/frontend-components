const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const glob = require('glob');

function parseLinks(term, links) {
  if (links.length === 1) {
    return links[0];
  }

  let fullMatch;
  let nextIndex = 0;
  const trimmedTerm = term.trim().replace(/\s/gm, '');
  while (!fullMatch && nextIndex < links.length) {
    const hash = links[nextIndex].includes('#') && links[nextIndex].split('#').pop();
    if (hash.length > 0 && trimmedTerm.includes(hash)) {
      fullMatch = links[nextIndex];
    }
    nextIndex += 1;
  }

  return fullMatch || links[0];
}

function getChromiumExectuablePath() {
  const paths = [
    ...glob.sync(path.resolve(__dirname, '../node_modules/puppeteer/.local-chromium/*/chrome-linux/chrome/')),
    ...glob.sync('/opt/app-root/src/.cache/puppeteer/chrome/*/chrome-linux/chrome')
  ];
  if (paths.length > 0) {
    return paths[0];
  } else {
    throw new Error('unable to locate chromium executable');
  }
}

const siteScraper = async () => {
  const allowedTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'em', 'p', 'table', 'li'];
  const data = allowedTags.reduce(
    (acc, curr) => ({
      ...acc,
      [curr]: {},
    }),
    {}
  );
  const file = 'site-map.json';
  const dataFile = 'search-index.json';
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: getChromiumExectuablePath(),
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();

  page.on('console', (msg) => {
    for (let i = 0; i < msg.args.length; ++i) console.log(`${i}: ${msg.args[i]}`);
  });

  async function getPageElements(link) {
    console.log(`Scraping page ${link}`);
    await page.goto(link);
    const elements = await page.evaluate(() => {
      try {
        const allowedTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'em', 'p', 'table', 'li'];
        const elems = [];
        allowedTags.forEach((tag) => {
          elems.push(
            ...Array.from(document.querySelectorAll(`main ${tag}`)).map((el) => ({
              tag,
              content: el.textContent,
            }))
          );
        });
        return Array.from(elems);
      } catch (error) {
        console.log(error);
        return [];
      }
    });

    elements.forEach(({ tag, content }) => {
      if (data[tag][content]) {
        data[tag][content].links.push(link);
      } else {
        data[tag][content] = {
          links: [link],
        };
      }
    });
  }

  const allPages = JSON.parse(fs.readFileSync(path.resolve(__dirname, file), { encoding: 'utf-8' }));
  const pagesLinks = Object.keys(allPages);
  for (let index = 0; index < pagesLinks.length; index++) {
    const link = pagesLinks[index];
    await getPageElements(link);
  }
  await browser.close();

  allowedTags.forEach((tag) => {
    const contentKeys = Object.keys(data[tag]);
    contentKeys.forEach((term) => {
      data[tag][term].linkResult = parseLinks(term, data[tag][term].links);
    });
  });

  fs.writeFileSync(path.resolve(__dirname, '../server-assets/', dataFile), JSON.stringify(data, null, 2));
};

module.exports = siteScraper;
