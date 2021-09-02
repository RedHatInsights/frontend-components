- [useScreenSize](#usescreensize)
  - [Usage](#usage)
  - [Breakpoints](#breakpoints)
  - [Variants](#variants)
  - [isSmallScreen](#issmallscreen)
  - [Testing](#testing)
    - [Using mock](#using-mock)
    - [Not mocked](#not-mocked)

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

## Testing

Here are some tips for simple testing different screen sizes in your testing environment.

### Using mock

1. Mock the hook

```jsx
jest.mock('@redhat-cloud-services/frontend-components/useScreenSize', () => ({
  __esModule: true,
  isSmallScreen: (size) => size === 'sm',
  useScreenSize: () => global.mockWidth || 'md',
}));
```

2. Set the size in a test before rendering and clean after the test is done

```jsx
it('should render dropdown on small screen', async () => {
    global.mockWidth = 'sm';

    wraper = ...

    ...

    global.mockWidth = undefined;
});
```

### Not mocked

To change a size of screen in your tests, use helper like this one:

```jsx
const changeSize = async (size) => {
    await act(async () => {
        global.innerWidth = size;
        global.dispatchEvent(new Event('resize'));
    });
    wrapper.update(); // enzyme update, depends on your testing library
};
```
