const util = require('util');
const { resolve } = require('path');
const dotenv = require('dotenv');
const fs = require('fs');

const bot = require('./comment-bot');
const { pushFile, octokit: pushBot } = require('./push-bot');
const exec = util.promisify(require('child_process').exec);

const readFile = (fileName) => util.promisify(fs.readFile)(fileName, 'utf8');
const writeFile = (fileName, data) => util.promisify(fs.writeFile)(fileName, data, 'utf8');
const readJson = (fileName) => readFile(fileName).then(JSON.parse);
const writeJson = (fileName, data) => writeFile(fileName, JSON.stringify(data, null, 4) + '\n');
const exists = (fileName) => util.promisify(fs.exists)(fileName);

dotenv.config();
const [ owner, repo ] = process.env.TRAVIS_REPO_SLUG.split('/');
const releaseType = process.env.RELEASE_TYPE;
const prNumber = process.env.PR_NUMBER;

const monorepoFolder = 'packages';

const releaseMapper = (type) => {
    const mapper = {
        major: (major) => `${parseInt(major, 10) + 1}.0.0`,
        minor: (major, minor) => `${major}.${parseInt(minor, 10) + 1}.0`,
        bugfix: (major, minor, bugfix) => `${major}.${minor}.${parseInt(bugfix, 10) + 1}`
    };
    return mapper[type] || mapper.bugfix;
};

const calculatePackages = async (files) => {
    const packages = await Promise.all(
      files.map(async ({ filename }) => {
        const packageFolder = `${filename.substring(monorepoFolder.length + 1).split('/')[0]}/`;
        (await exists(resolve(__dirname, `../${monorepoFolder}/${packageFolder}package.json`))) && packageFolder;
      })
    );
    return [ ...new Set(packages.filter(Boolean)) ];
};

const packageName = (pckgName, newVersion) => {
    const newNameVersion = `${pckgName}/v/${newVersion}`;
    const spaces = [ ...new Array(Math.max(0, 14 - Math.round(newNameVersion.length / 10))) ].map(() => '&emsp;').join('');
    return `${spaces}:package:[${newNameVersion}](https://www.npmjs.com/package/${newNameVersion}):package:`;
};

const releaseComment = (pckgName, newVersion) => `
&emsp;&emsp;&emsp;&emsp;&emsp;🌱  🌸 🌷 🌻 🌟  **New version of package has been released**  🌟  🌻 🌷 🌸 🌱

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;The release is available on:

**${packageName(pckgName, newVersion)}**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;:boom:This feature is brought to you by [probot](https://probot.github.io/):rocket:
`;

(async () => {
    if (!releaseType || !prNumber) {
        console.log(`Missing releaseType ${releaseType} or prNumber ${prNumber}.`);
        return ;
    }

    let files = [];
    const { data, headers: { link } } = await pushBot.pulls.listFiles({
        owner,
        repo,
        // eslint-disable-next-line camelcase
        pull_number: prNumber
    });
    files = data;
    if (link) {
        const pages = parseInt(link.split(',').find(item => item.includes('rel="last"')).trim().replace(/.*page=(\d+).*/, '$1'), 10);
        if (!isNaN(pages)) {
            for (let page = 2; page <= pages; page++) {
                const { data } = await pushBot.pulls.listFiles({
                    owner,
                    repo,
                    // eslint-disable-next-line camelcase
                    pull_number: prNumber,
                    page
                });
                files = [
                    ...files,
                    ...data
                ];
            }
        }
    }

    const packages = await calculatePackages(files);
    console.log(`Running release for packages ${packages}`);
    packages.map(async (packageFolder) => {
        const packagePath = resolve(__dirname, `../${monorepoFolder}/${packageFolder}package.json`);
        const pckg = await readJson(packagePath);
        if (pckg.private) {
          return;
        }
        const { stdout: version } = await exec(`npm view ${pckg.name} version`);
        const [ major, minor, bugfix ] = version.trim().split('.');
        const newVersion = releaseMapper(releaseType)(major, minor, bugfix);
        console.log(`Will trigger new version ${newVersion} for ${pckg.name}`);
        await writeJson(packagePath, { ...pckg, version: newVersion });
        const { stderr } = await exec(`cd ${resolve(__dirname, `../${monorepoFolder}/${packageFolder}`)} && npm publish && cd -`);
        console.log(stderr);
        console.log(`New comment for ${owner}/${repo} on PR ${prNumber}`);
        await bot.issues.createComment({
            owner,
            repo,
            // eslint-disable-next-line camelcase
            issue_number: prNumber,
            body: releaseComment(pckg.name, newVersion)
        });

        const packageUpdate = `${monorepoFolder}/${packageFolder}package.json`;
        console.log(`Pushing file ${packageUpdate} to ${owner}/${repo}`);
        pushFile(
            { repo, owner },
            packageUpdate,
            `Updating ${pckg.name} to ${newVersion}`
        );

        pushBot.issues.addLabels({
            owner,
            repo,
            // eslint-disable-next-line camelcase
            issue_number: prNumber,
            labels: [ 'released' ]
        });
    });
})();
