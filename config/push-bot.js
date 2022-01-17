const dotenv = require('dotenv');
const Octokit = require('@octokit/rest');
const util = require('util');
const fs = require('fs');
const { resolve } = require('path');

const readFile = (fileName) => util.promisify(fs.readFile)(fileName, 'utf8');

dotenv.config();

const octokit = Octokit({
  auth: process.env.GH_TOKEN_PUSH,
  userAgent: 'nacho-bot',
  previews: ['jean-grey', 'symmetra'],
  timeZone: 'Europe/Prague',
  baseUrl: 'https://api.github.com',
});

const encodeFile = async (filename) => Buffer.from(await readFile(filename)).toString('base64');

const pushFile = async ({ owner, repo }, fileName, message) => {
  let sha;
  try {
    const { data: contents } = await octokit.repos.getContents({
      owner,
      repo,
      path: fileName,
    });
    sha = contents && contents.sha;
  } catch (e) {
    console.log(`File ${fileName} not found! Will creatre new file.`);
  }

  const filePath = resolve(__dirname, `../${fileName}`);
  const content = await encodeFile(filePath);

  console.log(`File path of ${fileName} is: ${filePath}`);
  console.log(`Content of ${fileName} is: ${content}`);

  octokit.repos.createOrUpdateFile({
    owner,
    repo,
    path: fileName,
    message: message || 'Release of new version!',
    content: content,
    ...(sha && { sha }),
  });
};

module.exports = {
  pushFile,
  octokit,
};
