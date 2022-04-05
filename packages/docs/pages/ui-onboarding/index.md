# UI Onboarding

If you decide you want to have your application visible to other people (outside of your machine), you will have to deploy your application.

The deployment process for the applications on the Cloud Services Platform uses Akamai NetStorage (production and pre-production) to store and serve files that are used to render the pages.

To push files to each of the environments, we use Travis CI to build the code and then deploy the compiled/minified files to a build repo on the Red Hat Insights GitHub org.

In order to do that, we need to set up each development repo with an associated build repo.

Prerequisites

- You have figured out an id for your application (should be alphanumeric characters)
- You know the routes to your application

## Updating your starter application

1. Update your package.json with your app id
  a. [Package name](https://github.com/RedHatInsights/frontend-starter-app/blob/7e5d528393d1d1a27d2dc391ab885d03accf441c/package.json#L2)
  b. [App name](https://github.com/RedHatInsights/frontend-starter-app/blob/7e5d528393d1d1a27d2dc391ab885d03accf441c/package.json#L64) (Note: app and package names need not match.)
2. [Update your App.js with your app id](https://github.com/RedHatInsights/frontend-starter-app/blob/7e5d528393d1d1a27d2dc391ab885d03accf441c/src/App.js#L19)
3. Update the .travis.yml file
  a. [REPO](https://github.com/RedHatInsights/frontend-starter-app/blob/30ceb00dbff93ab7bd33707a6674345ab6b41213/.travis.yml#L23)
  b. [REPO\_DIR](https://github.com/RedHatInsights/frontend-starter-app/blob/30ceb00dbff93ab7bd33707a6674345ab6b41213/.travis.yml#L24)
4. Update your index.html with your app name

## Adding your app to Cloud Services config

1. Visit [Cloud Services Config](https://github.com/RedHatInsights/cloud-services-config)
2. [Register your application/module](https://github.com/RedHatInsights/cloud-services-config/blob/ci-beta/docs/chrome/docs.md#registering-new-module-app-to-chrome) (use your app-id that you set in your dev repo)
  a. You should also add your routes to the [correct navigation location](https://github.com/RedHatInsights/cloud-services-config/tree/ci-beta/chrome)

## Setting up a Build Repo and Deploy Key

**If you are an onboarding application, please contact the platform experience team for this step.**

1. **Clone the source repo**
2. **Remove existing key** (in the source repo)
  - Remove the deploy\_key.enc from the .travis folder in the source repo.
  - [Example](https://github.com/RedHatInsights/insights-remediations-frontend/tree/master/.travis)
3. **Generate the new key** (in the source repo)
  - ssh-keygen -t rsa -b 4096
    Save the key without a passphrase
  - Save the key as deploy\_key in {source-repo}/.travis/deploy\_key
    i. You should get a deploy\_key and deploy\_key.pub

4. **Add the new deploy key to the build repo** (build repo)
  - Copy the contents of the public key generated in step 2 ( **deploy\_key.pub** ) to the build repo under Settings → Deploy Keys and check the box for allowing write access. You can name this &quot;Travis CI&quot;.
  - [Example](https://github.com/RedHatInsights/insights-remediations-frontend-build/settings/keys)
5. **Encrypt the deploy key with Travis CLI** (source repo)
  - Make sure you have [Travis CI CLI tools](https://github.com/travis-ci/travis.rb)
    i. [Installation](https://github.com/travis-ci/travis.rb#installation) ** **
  - [Add a personal access token](https://github.com/settings/tokens) in github if you don&#39;t have one already
  - Login to Travis CLI with the --com flag with your github token
    i. travis login --com --github-token {token}
  - Verify that you are inside of your development repo and then encrypt the key with Travis CLI
    i. travis encrypt-file .travis/deploy\_key --com
  - You may be prompted to add an openssl command, **do not add the openssl command to the .travis file.**
  - After you encrypt the file, they automatically get added to travis
6. **Verify**
  - You should now have a deploy\_key.enc file
  - Delete deploy\_key and deploy\_key.pub
7. **Commit**
  - Commit your deploy\_key.enc file _**(DO NOT COMMIT THE PRIVATE KEY)**_
  - Open a PR against master branch
8. **Verify that the Travis env variables have been added**
  - [https://app.travis-ci.com/github/RedHatInsights/{source-repo}/settings](https://app.travis-ci.com/github/RedHatInsights/%7Bsource-repo%7D/settings)
  - The hash for the key and iv should match the hash you see in the logs after you run the encryption in Step 7
9. **Confirm** the build completed successfully on Travis-CI and verify that the files were pushed to your build repo.


# Deploying Your App

After the dev repo is set up, you can deploy your app using various branches. By default, a branch corresponds to an environment. Example)
  - branch: ci-beta will push to the ci-beta environment: ci.console.redhat.com

The naming convention follows env-{beta/stable}

# Custom Releases

Many teams want alignment between environments on the platform, so we allow a .custom\_release.sh file inside of your .travis directory in your dev repo.

You can set up any push logic you&#39;d like to in this repo. Many times, teams will align ci/qa together, so an example of that would be: 

  #!/bin/bash
  set -e
  set -x

  if [ "${TRAVIS_BRANCH}" = "master" ]
  then 
    for env in ci qa
    do
      echo "PUSHING ${env}-beta" 
      rm -rf ./dist/.git
      .travis/release.sh "${env}-beta"
    done
  fi

  if [ "${TRAVIS_BRANCH}" = "master-stable" ]
  then
    for env in ci qa
    do 
      echo "PUSHING ${env}-stable"
      rm -rf ./dist/.git
      .travis/release.sh "${env}-stable"
    done
  fi

  if [[ "${TRAVIS_BRANCH}" = "prod-beta" || 
  "${TRAVIS_BRANCH}" = "prod-stable" ]]; then
    echo "PUSHING ${TRAVIS_BRANCH}"
    rm -rf ./build/.git
    .travis/release.sh "${TRAVIS_BRANCH}"
  fi
  
  - master pushes to ci-beta and qa-beta


  - master-stable pushes to ci-stable and qa-stable


  - prod-beta pushes to prod-beta


  - prod-stable pushes to prod-stable