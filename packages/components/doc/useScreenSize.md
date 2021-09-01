- [useScreenSize](#usescreensize)
  - [Usage](#usage)
  - [Breakpoints](#breakpoints)
  - [Variants](#variants)
  - [isSmallScreen](#issmallscreen)

# useScreenSize

`useScreenSize` is a React hook that listens to windows resizing and returns a PatternFly variant of the current size. This hook is helping when different React structures has to be shown accordingly to the window size. For example, when you want to show a dropdown instead of a button set.

## Usage

```jsx
import useScreenSize from '@redhat-cloud-services/frontend-components/useScreenSize';

const DummyComponent = () => {
    const currentVariant = useScreenSize();

    return <div>Current PF4 variant is: {currentVariant}</div>;
};
```

## Breakpoints

`breakpoints` object is a map of `{ [variant]: size (as number) }`.

## Variants

Current variants can be found as keys of `breakpoints` object.

```jsx
['xs', 'sm', 'md', 'lg', '2xl']
```

## isSmallScreen

`isSmallScreen` is a simple helper that returns `true` if the current variant is a small screen.

```jsx
import { useScreenSize, isSmallScreen } from '@redhat-cloud-services/frontend-components/useScreenSize';

const DummyComponent = () => {
    const currentVariant = useScreenSize();

    if(isSmallScreen(currentVariant)) {
        return <div>Mobile content</div>;
    }

    return <div>Desktop content</div>;
};
```