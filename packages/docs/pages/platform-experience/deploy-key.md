# Setting up a build repo with deploy key

If you are an onboarding application, please contact the platform experience team for this step.

1. Clone the source repo
2. Remove existing key (in the source repo)
    * Remove the deploy_key.enc from the .travis folder in the source repo. [Example](https://github.com/RedHatInsights/insights-remediations-frontend/tree/master/.travis)
3. Generate the new key (in the source repo)
    * `ssh-keygen -t rsa -b 4096`
    * Save the key without a passphrase
    * Save the key as `deploy_key` in `{source-repo}/.travis/deploy_key`
        * You should get a deploy_key and deploy_key.pub
4. Add the new deploy key to the build repo (build repo)
    * Copy the contents of the public key generated in step 2 (deploy_key.pub) to the build repo under Settings → Deploy Keys and check the box for allowing write access. You can name this “Travis CI”. [Example](https://github.com/RedHatInsights/insights-remediations-frontend-build/settings/keys)
5. Encrypt the deploy key with Travis CLI (source repo)
    * Make sure you have [Travis CI CLI tools](https://github.com/travis-ci/travis.rb)
        * [Installation](https://github.com/travis-ci/travis.rb#installation)
    * [Add a personal access token](https://github.com/settings/tokens) in github if you don’t have one already
    * Login to Travis CLI with the --com flag with your github token
        * `travis login --com --github-token {token}`
    * Verify that you are inside of your development repo and then encrypt the key with Travis CLI
        * `travis encrypt-file .travis/deploy_key --com`
    * You may be prompted to add an openssl command, **do not add the openssl command to the .travis file.**
    * After you encrypt the file, they automatically get added to travis
6. Verify
    * You should now have a `deploy_key.enc` file
    * Delete `deploy_key` and `deploy_key.pub`
7. Commit
    * Commit your deploy_key.enc file **!!(DO NOT COMMIT THE PRIVATE KEY)!!**
    * Open a PR against master branch
8. Verify that the Travis env variables have been added
    * `https://app.travis-ci.com/github/RedHatInsights/{source-repo}/settings`
    * The hash for the key and iv should match the hash you see in the logs after you run the encryption in Step 7
9. Confirm the build completed successfully on Travis-CI and verify that the files were pushed to your build repo.
