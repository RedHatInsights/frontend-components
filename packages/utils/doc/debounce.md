# Debounce
We have a shared function in order to debounce multiple calls to any API call to be used if you are expecting multiple calls to happen in short period of time (for instance when user types in filter).

This function is using [awesome-debounce-promise](https://github.com/slorber/awesome-debounce-promise) with predefined values.

## Usage
1) Create debounced function and call it whenever you want to call API.

```JS
import { apiCall } from './your/api';
import debounce from '@redhat-cloud-services/frontend-components-utilities/files/debounce';

const debouncedFunc = debounce(apiCall);

let i;
for(i = 0; i < 5; i++) {
    debouncedFunc('value'); // only last apiCall will be called.
}
```

2) Custom debounce time
```JS
import { apiCall } from './your/api';
import debounce from '@redhat-cloud-services/frontend-components-utilities/files/debounce';

const debouncedFunc = debounce(apiCall, 150);

let i;
for(i = 0; i < 5; i++) {
    debouncedFunc('value'); // only last apiCall will be called after 150ms.
}
```
