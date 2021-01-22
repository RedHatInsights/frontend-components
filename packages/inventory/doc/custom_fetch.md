- [Custom fetch](#custom-fetch)
  - [getEntities](#getentities)
    - [items](#items)
    - [config](#config)
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
getEntities = (items: array, config: Config, showTags: boolean) => result as Result
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
