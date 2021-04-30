# useTableTools

`useTableTools` is a hook combining several hooks to built a PatternFly `Table` with the platform `PrimaryToolbar` component.
Each hook can also be used on their own to only leverage a specific functionality.

There is also a `TableToolsTable` component that is already setup with a table and invokes the `useTableTools` hook.

Both the hook and the component take at least an `items` and `columns` argument/prop.

## Items

Items can be an array of any object.


## Columns

Columns are defined similar to the default way of defining columns for the `Table` component,
but allow passing additional properties

* `key`
* `renderFunc`

## Hooks

All Hooks will return an object with two properties `toolbarProps` and/or `tableProps`,
both of them are meant to be spread as props for either the `PrimaryToolbar` or the `Table` component.

### useTableTools

```javascript
const items = [{
  name: 'Item #1'
}];
const columns = [{
  title: 'Name',
  key: 'name',
  transforms: [ sortable ],
  renderFunc: (name) => (
      name
  )
}]
const { toolbarProps, tableProps } = useTableTools(items, columns)
```

### useRowsBuilder

This hook takes `columns` and `options` and returns a function
which takes items and returns `rows` to use in a `Table` component
and optionally `pagination` to be passed to the `PrimaryToolbar` component.

#### Arguments

 * **columns** - an array of column objects with additional properties (see below)
 * **options** - see below

##### Options

 * **filter** - a function by which the items should be filtered by
 * **sorter** - a function by which the items should be sorted by
 * **paginate** - an object with
   * **paginator** - a function by which the items should be paginated by
   * **pagination** - an object with page, perPage

#### rowBuilder

The function return by `useRowsBuilder`.

##### Arguments

 * **items** - an array of object to render as rows

#### Return

 * **rows** - an array of rows for the `Table` component
 * **pagination** - a pagination object for the `PrimaryToolbar` component

### usePaginate

THe `usePaginate` hook takes an object with options and returns an object

#### Arguments

 * **options**
   * **perPage** - items per page
   * **itemsCount** - Number of items in the whole table

#### Returns

 * **paginator** - a function to paginate an array of items
 * **setPage** - a function to call to set a page
 * **pagination** - a pagination object to be used with the `PrimaryToolbar` (Or `Pagination` component)

### useTableSort

#### Arguments

 * **columns** - an array of column objects


### Additional column properties

 * **sortByProperty** - set the property by which the items should be sorted by
 * **sortByFunction** - allows to provide a function returning a comparable value
 * **sortByArray** - allows to provide an array by which the items should be sorted by

### useFilterConfig

 *
### useBulkSelect

## Basic component

For a basic table with the `useTableTools` hook invoked there is a `TableToolsTable` component that accepts a `items` and `columns` prop to build a table

## Arguments

## Additional cell object properties for columns:

 * **key** - sets the property of the object to be rendered (By default the whole object will be used)
 * **rednerFunc** - Function/Component to render a cell for the column


## Options:

 * **filterConfig** - configuration for the useFilterConfig hook
 * **detailsComponent** - component render a details row for each item

## Future feature ideas/plan:

 * Allow async loading of items via an async function
 * Integrate with REST APIs
