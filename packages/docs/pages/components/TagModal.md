# TagModal

## Props

|name|type|default|description|
|----|----|-------|-----------|
|tabNames|Array of: string|||
|loaded|bool &#124; Array of: bool|false||
|title|string|||
|systemName|string|||
|isOpen|bool|false||
|toggleModal|func|() => undefined||
|rows|array|[]||
|columns|array|[
    { title: 'Name' },
    { title: 'Tag source' }
]||
|className|string|||
|tableProps|{}|{}||
|onSelect|func &#124; Array of: func|||
|onUpdateData|func &#124; Array of: func|() => undefined||
|pagination|TableWithFilter.propTypes.pagination &#124; Array of: TableWithFilter.propTypes.pagination|{ count: 10 }||
|primaryToolbarProps|{}|||
|selected|array|||


