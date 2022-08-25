// These will work only in the docker container. Do not run them locally for other than testing purposes

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const glob = require('glob');

function getNewLinks(allLinks, hrefs, origin) {
  return hrefs.filter((link) => {
    const cleanLink = link.replace(/\/$/, '');
    return cleanLink.includes(origin) && !allLinks[cleanLink]?.visited;
  });
}

function getChromiumExectuablePath() {
  const paths = glob.sync(path.resolve(__dirname, '../node_modules/puppeteer/.local-chromium/*/chrome-linux/chrome/'));
  if (paths.length > 0) {
    return paths[0];
  } else {
    throw new Error('unable to locate chromium executable');
  }
}

const siteCrawler = async () => {
  const links = {};
  const file = 'site-map.json';
  const origin = 'http://localhost:3000';
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: getChromiumExectuablePath(),
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();

  async function visitPage(href) {
    if (!links[href]) {
      links[href] = {};
    }

    if (links[href].visited === true) {
      return;
    }

    console.info(`Visting page: ${href}`);
    links[href].visited = true;
    await page.goto(href);
    const hrefs = await page.$$eval('a', (as) => as.map((a) => a.href));
    const newLinks = getNewLinks(links, hrefs, origin);
    newLinks.forEach((link) => {
      links[link] = {
        visited: false,
      };
    });

    for (let index = 0; index < newLinks.length; index++) {
      await visitPage(newLinks[index]);
    }
  }

  await visitPage(origin);
  await browser.close();

  console.info(`Found ${Object.keys(links).length} different link elements`);
  fs.writeFileSync(path.resolve(__dirname, file), JSON.stringify(links, null, 2));
};

module.exports = siteCrawler;
