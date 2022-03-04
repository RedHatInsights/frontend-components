- [Custom fetch](#custom-fetch)
  - [getEntities](#getentities)
    - [items](#items)
    - [config](#config)
    - [defaultGetEntities](#defaultgetentities)
    - [result](#result)
      - [results](#results)
      - [total](#total)
      - [loaded](#loaded)
  - [Example](#example)

# Custom fetch

Inventory components provides a simple way for changing its loading function. This function replaces the internal `getEntities` function and allows customers to handle the whole data loading.

```jsx
<InventoryTable
    {...otherProps}
    getEntities={getEntities}
/>
```

## getEntities

```tsx
getEntities = (items: array, config: Config, showTags: boolean, defaultGetEntities: function) => result as Result
```

### items

Custom items. You should consider not using this array when using custom function as you can limit the items there.

### config

```jsx
{
    per_page: Number, page: Number, orderBy: String, orderDirection: String, filters: Filters
}
```

example:

```json
{
   "per_page":50,
   "page":3,
   "orderBy":"display_name",
   "orderDirection":"ASC",
   "filters":{
      "staleFilter":[
         "fresh",
         "stale"
      ],
      "registeredWithFilter":[
         "insights"
      ],
      "hostnameOrId":"rhel-123"
   },
   "tags":[],
   "filter":{
      "system_profile":{}
   },
   "sortBy":{
      "key":"display_name",
      "direction":"asc"
   },
   "hasItems":false
}
```

### defaultGetEntities

As the 4th argument, the default `getEntities` function is passed, so you can grab it and enhance it.

```jsx
import { mergeArraysByKey } from '@redhat-cloud-services/frontend-components-utilities/helpers';

customGetEntities = async (_items, config, showTags, defaultGetEntities) => {
    const customResult = await getCustomItems(config); // load your items and data
    // example: { rows: [...], total: 637 }

    const items = customResult.rows.map(({ id }) => id ); // has to be an array of IDs
    const enhancedConfig = { ...config, hasItems: true }; // hasItems have to be set to true

    const defaultData = await defaultGetEntities(items, enhancedConfig, showTags); // get default data for your items from inventory API

    return {
        results: mergeArraysByKey([ defaultData.results, customResult.rows ]) // merge common data and your data based on their ids (you can also use your own solution)
        total: customResult.total
    };
}
```

### result

You should follow this simple format of data:

```jsx
{
    results,
    total,
    // optional
    loaded
}
```

#### results

An array of entities.

#### total

Total number of all entities based on the filters.

#### loaded

Set loaded to `false`, when loading was not successful.

## Example

```jsx
<InventoryTable
    {...props}
    getEntities={async (
        items, { per_page, page, orderBy, orderDirection, ...rest
    }) => {
        const result = await fetch(`/api/application/v1/systems?page_size=${
            per_page}&page=${page}`).then(data => data.json());

        return {
            results: result.data,
            total: result.meta.total_items
        };
    }}
/>
```
