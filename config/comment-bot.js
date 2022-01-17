const dotenv = require('dotenv');
const Octokit = require('@octokit/rest');

dotenv.config();

const octokit = Octokit({
  auth: process.env.GH_TOKEN_BOT,
  userAgent: 'nacho-bot',
  previews: ['jean-grey', 'symmetra'],
  timeZone: 'Europe/Prague',
  baseUrl: 'https://api.github.com',
});

module.exports = octokit;
