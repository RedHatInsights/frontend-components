# TagModal

## Props

|name|type|default|description|
|----|----|-------|-----------|
|tabNames|`Array of: string`|||
|loaded|`bool | Array of: bool`|false||
|title|`string`|||
|systemName|`string`|||
|isOpen|`bool`|false||
|toggleModal|`func`|() => undefined||
|rows|`array`|[]||
|columns|`array`|[
    { title: 'Name' },
    { title: 'Tag source' }
]||
|className|`string`|||
|tableProps|`{}`|{}||
|onSelect|`func | Array of: func`|||
|onUpdateData|`func | Array of: func`|() => undefined||
|pagination|`TableWithFilter.propTypes.pagination | Array of: TableWithFilter.propTypes.pagination`|{ count: 10 }||
|primaryToolbarProps|`{}`|||
|selected|`array`|||


