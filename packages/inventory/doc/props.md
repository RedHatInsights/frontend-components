- [Props](#props)
  - [getEntities](#getentities)
  - [hideFilters](#hidefilters)
  - [columns](#columns)
  - [disableDefaultColumns](#disabledefaultcolumns)
  - [ref](#ref)
  - [onLoad](#onload)
  - [showTags](#showtags)
  - [customFilters](#customfilters)
  - [hasCheckbox](#hascheckbox)
  - [isFullView](#isfullview)
  - [onRefresh](#onrefresh)
  - [tableProps](#tableprops)
  - [paginationProps](#paginationprops)
  - [autoRefresh](#autorefresh)
  - [initialLoading](#initialloading)

# Props

## getEntities

*function*

A function allowing to replace default fetch function, so each application can load its specific data.

[Read more.](./custom_fetch.md)

## hideFilters

*object*

An object allowing to hide default filters.

[Read more.](./hide_filters.md)

## columns

*array*

An array of columns definitions. They are merged with default columns by their keys.

## disableDefaultColumns

*boolean | string[]*

You can disable default columns. If you set this prop to `true`, then all the default columns are disabled. Or you can provide an array of keys to disable just specific ones: `[ 'display_name', 'last_seen' ]`. **This prop is working only with `columns` prop!** If you are changing columns via reducer, nothing changes. But you should consider migrating your application to use the prop.

## ref

*ref*

## onLoad

*function*

## showTags

*boolean*

## customFilters

*object*

## hasCheckbox

*boolean*

## isFullView

*boolean*

## onRefresh

*function*

Function called when table is refreshed.

## tableProps

*object*

Props passed to table component.

## paginationProps

*object*

Props passed to paginations components.

## autoRefresh

*boolean*

When `true`, the table is refreshed when `customFilters` are changed.

## initialLoading

*boolean*

When `true`, the table is in loading state on mount until `entities.loaded` is set to `false` (and from that point, `loaded` is the only determinator.). Use when users can go back to already loaded table, this prop ensures that there will be no change from `loaded` > `loading` > `loaded`.
