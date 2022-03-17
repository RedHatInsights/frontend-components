## Chrome navigation

Chrome leverages [Cloud Services Config](https://github.com/redhatinsights/cloud-services-config) (CSC) to build the navigation on a bundle-by-bundle basis.

## Dynamic Navigation

Along with static navigation set in CSC, apps can opt into dynamic navigation by updating the `<namespace-navigation>` file with a few options:

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
