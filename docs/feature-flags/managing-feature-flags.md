# Managing feature flags

## Prerequisites

1. Your GH account must be part of the AppSRE org
2. Your app-interface user config must have these roles:
  - `insights-stage-unleash-admin`
  - `insights-unleash-admin`

### Add app-interface roles

1. Open an MR in the `app-interface` GitLab repo. You can follow this [example](https://gitlab.cee.redhat.com/service/app-interface/-/merge_requests/44387).
2. Ping the `@crc-app-int-team` to review the MR in the `#forum-consoledot` CoreOS slack channel

## Add a new feature flags

- Go to [stage unleash](https://insights-stage.unleash.devshift.net) or [prod unleash](https://insights.unleash.devshift.net/)
- Click on the *New feature toggle*

![Open new unleash feature flag page](/feature-flags/unleash-new.png)

- Give your feature flag a name
  - **Make sure the flag has an accurate and unique name**
  - eg: `platform.chrome.env.production`
- Click the *Create Feature* button

![Create new unleash feature flag](/feature-flags/features-create.png)

- You will be redirected to the feature detail
- Add the feature flag strategy

![Alter feature flag strategy](/feature-flags/features-strategy.png)

- Update the feature flag status

![Alter feature flag status](/feature-flags/update-status.png)
