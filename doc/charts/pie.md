# Pie Chart

This component is very similar to the [Donut chart](donut.md). Except there's no total and totalLabel.

## A simple example

```jsx

let pieValues = [
    ['value1', 5],
    ['value2', 10],
    ['value3', 20],
    ['value4', 40]
];

<Pie values={pieValues} identifier='my_cool_pie' withLegend={true} />
```

## Props

```JS
{
    className: propTypes.string,
    height: propTypes.number,
    identifier: propTypes.string,
    values: propTypes.array,
    width: propTypes.number,
    withLabel: propTypes.bool,
    legendPosition: propTypes.oneOf(Object.keys(LegendPosition))
}
```
