# UI deployment process

If you decide you want to have your application visible to other people (outside of your machine), you will have to deploy your application.

The deployment process for the applications on the Cloud Services Platform uses Akamai NetStorage (production) or Fakamai (pre-production) to store and serve files that are used to render the pages.

To push files to each of the environments, we use Travis CI to build the code and then deploy the compiled/minified files to a build repo on the Red Hat Insights GitHub org.

In order to do that, we need to set up each development repo with an associated build repo.

## Prerequisites

If you have already been through the UI onboarding step, please pick up here. Otherwise, visit the [UI Onboarding section in the docs](./ui-onboarding)

## Setting up a Build Repo and Deploy Key

**If you are an onboarding application, please contact the platform experience team for this step.**

1. **Clone the source repo**
2. **Remove existing key** (in the source repo)
    * Remove the deploy\_key.enc from the .travis folder in the source repo.
    * [Example](https://github.com/RedHatInsights/insights-remediations-frontend/tree/master/.travis)

3. **Generate the new key** (in the source repo)
    * ssh-keygen -t rsa -b 4096
      Save the key without a passphrase
    * Save the key as deploy\_key in {source-repo}/.travis/deploy\_key
      i. You should get a deploy\_key and deploy\_key.pub

4. **Add the new deploy key to the build repo** (build repo)
    * Copy the contents of the public key generated in step 2 ( **deploy\_key.pub** ) to the build repo under Settings → Deploy Keys and check the box for allowing write access. You can name this &quot;Travis CI&quot;.
    * [Example](https://github.com/RedHatInsights/insights-remediations-frontend-build/settings/keys)
5. **Encrypt the deploy key with Travis CLI** (source repo)
    * Make sure you have [Travis CI CLI tools](https://github.com/travis-ci/travis.rb)
      i. [Installation](https://github.com/travis-ci/travis.rb#installation) ** **
    * [Add a personal access token](https://github.com/settings/tokens) in github if you don&#39;t have one already
    * Login to Travis CLI with the --com flag with your github token
      i. travis login --com --github-token {token}
    * Verify that you are inside of your development repo and then encrypt the key with Travis CLI
      i. travis encrypt-file .travis/deploy\_key --com
    * You may be prompted to add an openssl command, **do not add the openssl command to the .travis file.**
    * After you encrypt the file, they automatically get added to travis
6. **Verify**
    * You should now have a deploy\_key.enc file
    * Delete deploy\_key and deploy\_key.pub
7. **Commit**
    * Commit your deploy\_key.enc file _**(DO NOT COMMIT THE PRIVATE KEY)**_
    * Open a PR against master branch
8. **Verify that the Travis env variables have been added**
    * [https://app.travis-ci.com/github/RedHatInsights/{source-repo}/settings](https://app.travis-ci.com/github/RedHatInsights/%7Bsource-repo%7D/settings)
    * The hash for the key and iv should match the hash you see in the logs after you run the encryption in Step 7
9. **Confirm** the build completed successfully on Travis-CI and verify that the files were pushed to your build repo.

<!-- Describe the travis -> build repo -> jenkins -> akamai process -->

## Deploying

Once you have Travis and your build repository set up, you can now deploy your code.

We use a branching strategy when pushing code. This means that each branch in your dev repo correlates to an environment.

By default, branches look like:

| Branch       | Environment | URL                           |
|--------------|-------------|-------------------------------|
| Main/Master  | stage-beta  | console.stage.redhat.com/beta |
| prod-beta    | prod-beta   | console.redhat.com/beta       |
| stage-stable | stage       | console.stage.redhat.com      |
| prod-stable  | prod        | console.redhat.com            |

These can be modified by creating a `custom_release.sh` file.

An example of that:

```sh
#!/bin/bash
  set -e
  set -x

  if [ "${TRAVIS_BRANCH}" = "beta" ]
  then 
    for env in stage prod
    do
      echo "PUSHING ${env}-beta" 
      rm -rf ./dist/.git
      .travis/release.sh "${env}-beta"
    done
  fi

  if [ "${TRAVIS_BRANCH}" = "stable" ]
  then
    for env in stage prod
    do 
      echo "PUSHING ${env}-stable"
      rm -rf ./dist/.git
      .travis/release.sh "${env}-stable"
    done
  fi
```

Now, the branch structure looks like

| Branch | Environment | URL                           |
|--------|-------------|-------------------------------|
| beta   | stage-beta  | console.stage.redhat.com/beta |
| beta   | prod-beta   | console.redhat.com/beta       |
| stable | stage       | console.stage.redhat.com      |
| stable | prod        | console.redhat.com            |

If code is pushed to a valid branch and everything builds successfully, you should get your `/dist` folder pushed to the `-build` repo.

Once your code is in the build repo, Jenkins will pick up the code automatically and then rsync the codebase to Akamai NetStorage.

If all of that is successful, you should be able to see the built code in the web browser. If you ever want to check your build hash or other information, we expose an info file at `https://console.redhat.com/apps/{appName}/app.info.json` in the browser.

Example) https://console.redhat.com/apps/chrome/app.info.json
