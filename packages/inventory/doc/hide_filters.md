- [hideFilters](#hidefilters)
  - [tags](#tags)
  - [name](#name)
  - [registeredWith](#registeredwith)
  - [stale](#stale)

# hideFilters

You can disable default filters by using a `hideFilters` prop.

```jsx
    hideFilters: PropTypes.shape({
        tags: PropTypes.bool,
        name: PropTypes.bool,
        registeredWith: PropTypes.bool,
        stale: PropTypes.bool
    })
```

By default all filters are set to `true`. You can override just part of it.

```jsx
<InventoryTable
    hideFilters={{name: true}}
/>
```

This props is also passed to [custom fetch](./custom_fetch.md).

Hiding filters also removes their default values.

## tags

Similar to `showTags`, it hides the tags filter.

## name

Hides display name filter.

## registeredWith

Hides registered with filter.

## stale

Hides staleness filter.
