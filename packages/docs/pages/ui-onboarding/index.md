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

## Deploying

Once you area ready to deploy, go to our [deployment process page](./deployment-process)
