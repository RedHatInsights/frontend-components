# NotAuthorized

## Props

|name|type|required|default|description|
|---|---|---|---|---|
|serviceName|node|if `title` prop is undefined|`undefined`|Name of a service for which current user is not authorized.|
|title|node|`false`|`undefined`||
|description|node|`ContactBody`|`false`||
|icon|`React.ComponentType`|`false`|`LockIcon`|Main empty state icon|
|showReturnButton|`boolean`|`false`|`true`|Flag to display the return button. Button will return users to previous page or to landing page. User will be redirected to landing page if there is no history stack.|
|actions|`node(s)`|`false`|`null`|Custom actions placed after the description. Actions **do not replace** the return buttons.|
|className|`string`|`false`|`undefined`|Custom className for the root empty state element|
|prevPageButtonText|`node`|`false`|Return to previous page|Text for the return redirect button.|
|toLandingPageText|`node`|`false`|Go to landing page|Text for the landing page redirect button.|