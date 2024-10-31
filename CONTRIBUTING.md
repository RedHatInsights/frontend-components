# Contributing to Frontend Components

## Table of Contents

- [Type of packages](#type-of-packages)
- [Git account requirements](#git-account-requirements)
- [Testing](#testing)
- [Commit messages](#commit-messages)
- [PR checks](#pr-checks)
- [Reviews](#reviews)
- [Release process](#release-process)
- [Local development](#local-development)
- [Docs](#docs)

## Type of packages

This project contains packages that are tied to the console.redhat.com site. This repository should contain generic UI Components, functions, utilities and other tooling that is generic and can be used the majority of the consoledot services.

If you are looking for a place to publish an application specific packages, please consider using your own project or preferably use module federation to share common code your service(s). The platform experience team will be happy to help you with setting up your project, including building and publishing. But the team does not have capacity to maintain service specific projects. 

If you are looking for generic Patternfly components, we encourage you to look at [Patternfly extensions documentation](https://www.patternfly.org/extensions/about-extensions).

## Git account requirements

For security reasons, it is mandatory that accounts that want to contribute to this repository have the following settings:

- [2FA enabled](https://docs.github.com/en/authentication/securing-your-account-with-two-factor-authentication-2fa/configuring-two-factor-authentication) for contributor accounts
- Commits signed with[ GPG key](https://docs.github.com/en/authentication/managing-commit-signature-verification/adding-a-gpg-key-to-your-github-account) to verify the contributor identity

We won't be able to accept contributions from accounts without these settings.

## Testing

### Component testing

Any React components should be tested by using Cypress component testing. This type of test is preferred due to the fact that the tests are running in a browser environment rather than in a mocked environment like JSDOM which can lead to misleading results.

If the project you are working on does not have cypress component testing setup, please contact the platform experience teams.

#### Starting component tests

To run a package test suite, use the NX workspace manager and execute a task:

```sh
# Generic example
npx nx run <full-name-of-package>:test:component
# Example from the components package
npx nx run @redhat-cloud-services/frontend-components:test:component
```

To open the browser preview and enable quick debugging and development of tests, use the `--watch` flag.

```sh
npx nx run @redhat-cloud-services/frontend-components:test:component --watch
```

### Unit testing

To write unit test, this repository is using the [Jest](https://jestjs.io/) framework.

In order to test react features like hooks, the project uses the [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) tool.

If you want to test React components, we strongly recommend using using Cypress [component testing](#component-testing). Interacting with component via JSDOM might expose issues when interacting with component via real DOM.

To run a package test suite, use the NX workspace manager and execute a task:

```sh
# Generic example
npx nx run <full-name-of-package>:test:unit
# Example from the components package
npx nx run @redhat-cloud-services/frontend-components:test:unit
```

#### Snapshot tests

Jest snapshot testing might seems like a quick and easy solution to test your React component. However we do not recommend using it. There are several challenges that come with these types of tests:

- Reviewing DOM snapshots is difficult and a lot of the times skipped by reviewers.
- Generated DOM attributes make the tests unstable (PF ids, OUIA ids).
- Visual changes are not reflected.

## Commit messages

This repository is using the [Conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) message format. Please follow the specification.

## PR checks

Pr checks in this project are mandatory due to the automated release process. The repository is using [husky](https://typicode.github.io/husky/) to run some of the checks before changes are pushed.

If for whatever reason you need to skip these checks from running locally, use the `--no-verify` flag in your git command. Skipping these checks locally **will not skip them in the CI environment**.

## Reviews

Many contributors already have rights to review and merge pull requests. Dues to the broad scope of this repository, there is no default set of reviewers added to pull requests. We kindly ask you to tag reviewers that have the best knowledge of the specific domain. If you are not sure who to tag, you can tag the `@platform-experience` team.

## Release process

The release process is fully automated and triggered after a pull request is merged. We rely on the conventional commit specification to update package version numbers.

## Local development

Before using the developer environment, make sure you have installed all the dependencies using the `npm i` command.

To develop UI packages, there is a sandbox environment which is linked to all existing frontend packages in the repository. You can start the environment by running the following script:

```sh
npm run serve:demo
```

You can then open the browser on `http://localhost:4200/` address.

The source of the demo page is available in `examples/demo/src/app/app.tsx` file. Please do not commit changes to this file.

## Docs

Please add your documentation to the `docs` directory.

We are still trying to come up with a nice solution to easily track and monitor missing/outdated documentation. 
