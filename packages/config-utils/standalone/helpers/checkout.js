const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

function checkoutRepo({ repo, reposDir, overwrite }) {
  if (!fs.existsSync(reposDir)) {
    console.log('Making repos dir', reposDir);
    fs.mkdirSync(reposDir);
  }

  let [remote, branch = 'master'] = repo.split('#');
  /**
   * Chrome does not have stage and stage beta branches.
   * For stage env, the QA build is used.
   * This is actually quite common for applications as well, we should definetly check other application as well and maybe apply this rule for every remote.
   */
  if(remote.includes('insights-chrome-build') && branch.includes('stage-')) {
    branch = branch.replace('stage-', 'qa-')
  }

  const split = remote.split('/');
  const toDir = split[split.length - 1];
  const repoPath = path.join(reposDir, toDir);
  if (!fs.existsSync(repoPath)) {
    console.log('cloning', branch, 'branch of', remote);
    execSync(`git clone --depth 1 --branch ${branch} ${remote}`, { cwd: reposDir });
  }
  else if (overwrite) {
    console.log('checking out', branch, 'branch of', remote);
    // User could potentially be offline
    try {
      execSync(`git fetch --depth 1 origin --force ${branch}:refs/remotes/origin/${branch}`, { cwd: repoPath });
    }
    catch (e) {
      console.error("Could not fetch remote, maybe you're offline?", e.toString());
    }
    try {
      execSync(`git checkout -B ${branch} origin/${branch}`, { cwd: repoPath });
    }
    catch (e) {
      console.error(`Could not checkout ${branch}, maybe you're offline and haven't fetched it before?`, e.toString());
    }
  }
  else {
    console.log('skipping', branch, 'branch of', repo, "since its user-managed. you'll have to checkout the correct code yourself");
  }

  return repoPath;
}

module.exports = { checkoutRepo };
