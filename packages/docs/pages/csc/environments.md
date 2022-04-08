# Environments

## Branch links and syncing

These are the urls for each branch:

### Beta

* ci-beta -> <https://ci.console.redhat.com/beta>
* qa-beta -> <https://qa.console.redhat.com/beta>
* stage-beta -> <https://console.stage.redhat.com/beta>
* prod-beta -> <https://console.redhat.com/beta>

### Stable

* ci-stable -> <https://ci.console.redhat.com>
* qa-stable -> <https://qa.console.redhat.com>
* stage -> <https://console.stage.redhat.com>
* prod-stable -> <https://console.redhat.com>

These branches sync:

* ci-beta -> qa-beta -> stage-beta
* ci-stable
* qa-stable -> stage-stable

## Adding Config for New Apps

To enable a new app in our environments, you need to create configuration for it in `main.yml` and in `/chrome` directory. After that create a PR to merge it into the `ci-beta` branch. The configuration for the non-prod beta branches is kept in sync. Changes to `ci-beta` will automatically be merged into `qa-beta` (as mentioned above).

When you need this config added to another environment (`prod-beta`, `ci-stable`, `qa-stable`, `prod-stable`), please open another PR for that environment. If you have any concerns about this process, feel free to ping #forum-clouddot-ui on Slack for assistance.

