# UI deployment process

If you decide you want to have your application visible to other people (outside of your machine), you will have to deploy your application.

The deployment process for the applications on the Cloud Services Platform uses Akamai NetStorage (production) or Fakamai (pre-production) to store and serve files that are used to render the pages.

To push files to each of the environments, we use Travis CI to build the code and then deploy the compiled/minified files to a build repo on the Red Hat Insights GitHub org.

In order to do that, we need to set up each development repo with an associated build repo.

## Prerequisites

You have figured out an id for your application (should be alphanumeric characters)
You know the routes to your application

* Updating your starter application
* Update your package.json with your app id
* Package name
* App name
* Update your App.js with your app id
* Update the .travis.yml file
* REPO
* REPO_DIR
* Update your index.html with your app name

* Adding your app to Cloud Services config
* Visit Cloud Services Config
* Register your application/module (use your app-id that you set in your dev repo)
* You should also add your routes to the correct navigation location

## Setting up a Build Repo and Deploy Key

If you are an onboarding application, please contact the platform experience team for this step.
Clone the source repo
Remove existing key (in the source repo)
Remove the deploy_key.enc from the .travis folder in the source repo.

### Example

* Generate the new key (in the source repo)
`ssh-keygen -t rsa -b 4096`
* Save the key without a passphrase
* Save the key as deploy_key in {source-repo}/.travis/deploy_key
* You should get a deploy_key and deploy_key.pub
* Add the new deploy key to the build repo (build repo)
* Copy the contents of the public key generated in step 2 (deploy_key.pub) to the build repo under Settings → Deploy Keys and check the box for allowing write access. You can name this “Travis CI”.
* Encrypt the deploy key with Travis CLI (source repo)
* Make sure you have Travis CI CLI tools

## Installation

Add a personal access token in github if you don’t have one already
Login to Travis CLI with the --com flag with your github token
travis login --com --github-token {token}
Verify that you are inside of your development repo and then encrypt the key with Travis CLI
travis encrypt-file .travis/deploy_key --com
You may be prompted to add an openssl command, do not add the openssl command to the .travis file.
After you encrypt the file, they automatically get added to travis
Verify
You should now have a deploy_key.enc file
Delete deploy_key and deploy_key.pub
Commit
Commit your deploy_key.enc file (DO NOT COMMIT THE PRIVATE KEY)
Open a PR against master branch
Verify that the Travis env variables have been added
<https://app.travis-ci.com/github/RedHatInsights/{source-repo}/settings>
The hash for the key and iv should match the hash you see in the logs after you run the encryption in Step 7
Confirm the build completed successfully on Travis-CI and verify that the files were pushed to your build repo.

Describe the travis -> build repo -> jenkins -> akamai process
