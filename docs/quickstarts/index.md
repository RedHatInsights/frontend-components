# Quickstarts

The console.redhat.com provides API to its micro frontends to consume and use UI guided tours powered by <a href="https://github.com/patternfly/patternfly-quickstarts" target="_blank">patternfly quickstarts</a>.

**Make sure you have done the [setup](/quickstarts/setup).**

## Consuming quickstarts methods.

To use the global quickstarts component, it has to be accessed via public API. The public API is available through the `useChrome` hook.

```jsx
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';

const Component = () => {
  const { quickStarts } = useChrome()
}
```

### `activateQuickstart`

Used to activate a single quickstart. Chrome will attempt to fetch the quickstart content from the Quickstarts API. If successful, the quickatart drawer will open.

```js
const { quickStarts } = useChrome()
quickStarts.activateQuickstart('quickstart-name')
```

```ts
activateQuickstart: (name: string) => Promise<void>
```


### `updateQuickStarts` 

*Has a set alias*

Used to populate the quickstarts context with content.

```js
const { quickStarts } = useChrome()
quickStarts.updateQuickStarts('insights', [quickStarts1, quickStarts2, ...])
```

```ts
updateQuickStarts: (key: string, quickStarts: QuickStart[]) => void
```

### `addQuickstart`

Similar to `updateQuickStarts`. Add a single quickstart to context. Returns `false` if content validation failed.


```js
const { quickStarts } = useChrome()
quickStarts.add('insights', quickStart)
```

```ts
add: (key: string, qs: QuickStart) => boolean
```

### `toggle`

Open quickstart drawer with a content. Can be used to close the panel when argument is an empty string. The quickstart content **must be already in the context**. Use the `updateQuickStarts` or `addQuickstart` to populate it.

Alternatively, use the `activateQuickstart` method, if the content is available in the quickatarts API.

```js
const { quickStarts } = useChrome()
// attempt to open panel with "quickstart-name" quickstart content 
quickStarts.toggle('quickstart-name')
// close the panel
quickStarts.toggle('')
```

```ts
toggle: (id: string) => void
```

### `Catalog`

A default quickstarts Catalog component. Can be used to render the default catalog. Catalog will be populated with all quickstarts available in the context.

```jsx
const { quickStarts: { Catalog } } = useChrome()

<Catalog />
```