# Examples

Here is some example configuration that demonstrates the structure, using all required and optional properties:

## `main.yml`

```yml
{app_id}:
    title: App Title
    api:
        versions:
            - v1
            - v2
        subItems:
            oneApi:
                title: Some title
                versions:
                    - v1
    channel: '#some-slack-channel'
    description: App Title is a cool app that does business things for its users.
    deployment_repo: https://github.com/app-deployment-repo-url
    disabled_on_prod: true
    docs: https://link.to.docs.com/docs
    permissions:
        method: isOrgAdmin
        apps:
            - app_id_1
    frontend:
        paths:
            - /example/path
            - /another/example/path
    source_repo: https://github.com/app-development-repo-url
    mailing_list: app-title@redhat.com
```

### `/chrome/fed-modules.json`

Add new application metadata to chrome modules registry.

[More details](https://github.com/RedHatInsights/cloud-services-config/blob/ci-beta/docs/chrome/docs.md#registering-new-module-app-to-chrome)

```js
{
    /** app-id must be the same as in the main.yml file */
    "<app-id>": {
        "manifestLocation": "/apps/<app-id>/fed-mods.json",
        "modules": [
            {
                "id": "module identifier",
                "module": "./RootApp",
                "routes": [
                    "/example/path",
                    "/another/example/path"
                ]
            }
        ]
    }
}
```
### `/chrome/<bundle>-navigation.json`

Add a new link to chrome navigation files. The navigation registry file is based on application location within the chrome application. For example, if the application should live under `/settings` route, modify the `settings-navigation.json` file.

[More details](https://github.com/RedHatInsights/cloud-services-config/blob/ci-beta/docs/chrome/docs.md#adding-a-new-top-level-link-to-the-chrome-left-navigation)

```js
{
    /** app-id must be the same as in the main.yml file */
    "appId": "<app-id>",
    /** Title of the link in browser */
    "title": "App title",
    /** Exact URL path to the application. Can be a nested route. */
    "href": "/settings/new-app"
}
```

### Required Properties (All Apps)

Each of the following properties is required for all apps:

#### app_id

This is your app's ID. It's used as the path to your app, and must be unique.

#### app_id.title

The main title for your app. This is what you want everyone to see when they use your app.

#### app_id.deployment_repo

This is the location of your app's deployment repo (not development repo). These repos generally have `build` or `deploy` as a suffix.

### API Properties

The following properties are used if your app has an API:

#### app_id.api.versions

This is the list of API versions your app can use. Since `v1` is the default, you'll usually want at least that one defined.

#### app_id.api.subItems

If your API consists of multiple APIs, you can list them here. Each has the same signature as `{app_id.api}`.

#### app_id.api.apiName

If your API is accessible on a URL other than `/api/{app_id}/{versions[0]}/openapi.json`, you can change it by passing the correct name. The URL will look like `/api/{apiName}/{versions[0]}/openapi.json`

### Frontend Properties

The following properties are used if your app has a frontend:

#### app_id.frontend.title

If you want the name of your app to appear differently on the frontend, set this property to override it.

#### app_id.frontend.app_base

If you want this app to use the same codebase as another existing app, set this value to the ID of that app.

#### app_id.frontend.paths

This is the list of URL paths where your app will be located.

### Other Optional Properties

The following properties aren't required for all apps, but may still apply to your app:

#### app_id.productId

The Red Hat product ID for your application. This is tied to fields on Portal Case Management for pre-filling information.

#### app_id.infoId

Some applications are mounted in two locations, but use the same base repo (ex. RBAC and MUA), in this case MUA needs to point to RBAC's app.info.json, so this is the base app for that url.

#### app_id.channel

This is the ID of the slack channel on ansible.slack.com that you want automatic notifications to be posted to.

#### app_id.description

This is a description of your app's purpose or functionalities, which is used by some other apps.

#### app_id.disabled_on_prod

Setting this value to `true` will disable the app from deploying to Prod (and appearing in Prod). This applies to both `stable` and `beta` releases.

#### app_id.docs

This is the link to your app's documentation.

#### app_id.source_repo

This is the URL of the development (not deployment) repo for your app, i.e. the one you commit to.

#### app_id.mailing_list

This is the mailing list associated with your project. Used to automate email notifications.

### Permissions

List of available permissions methods:

* `isOrgAdmin` - test if logged in user is organization admin
* `isActive` - test if logged in user is active
* `isInternal` - test if logged in user is internal
* `isEntitled` - test if logged in user is entitled, entitlements to check for is passed as an argument
* `isProd` - test if current environment is production (prod-beta and prod-stable)
* `isBeta` - test if current environment is beta (ci-beta, qa-beta and prod-beta)
* `isHidden` - hides item in navigation
* `withEmail` - show nav only if user's email contains first argument
* `hasLocalStorage` - test if value (passed as second argument) equals to localStorage key (passed as first arg) value
* `hasCookie` - test if value (passed as second argument) equals to cookie  key (passed as first arg) value
* `hasPermissions` - test if current user has rbac role permissions ['app:scope:permission'], uses logical AND to evaluate the permissions
* `loosePermissions` - similar to `hasPermissions`, uses logical OR to evaluate the permissions
* `apiRequest` - call custom API endpoint to test if the item should be displayed.
  * Expects `true`/`false` response.
  * `accessor` attribute can be specified. If the boolean value is in nested object. The accessor is a string path of [lodash get](https://lodash.com/docs/4.17.15#get) function.
  * If the promise receives an error, the item won't be displayed.
  * `matcher`: `['isEmpty' | 'isNotEmpty']`.
    * `isEmpty` uses [lodash isEmpty](https://lodash.com/docs/4.17.15#isEmpty) to evaluate api response.
    * `isNotEmpty` is a negation of `isEmpty`

#### apiRequest example

```JSON
{
    "appId": "sources",
    "title": "Sources",
    "href": "/settings/sources",
    "permissions": [
        {
            "method": "apiRequest",
            "args": [
                {
                    "url": "/api/sources/v3.1/sources",
                    "matcher": "isNotEmpty"
                }
            ]
        }
    ]
}
 ```

#### Multiple permissions example

Each nav item can have multiple required permissions. If **all checks are successful** the item will display.

```JSON
{
    "appId": "sources",
    "title": "Sources",
    "href": "/settings/sources",
    "permissions": [
        {
          "method": "hasPermissions",
          "args": [["sources:foo:bar"]]
        },
        {
            "method": "apiRequest",
            "args": [
                {
                    "url": "/api/sources/v3.1/sources",
                    "matcher": "isNotEmpty"
                }
            ]
        }
    ]
}
```
