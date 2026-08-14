# Ouia Selectors

Ouia selectors provide utilities for fetching Ouia components by the `component-type` and `component-id`.
It Allows to chain calls to search for components within a component.
The inputs and results of these calls are compatible with the [Testing Library](https://testing-library.com/).

The API is modeled after the [Testing Library](https://testing-library.com/).
You will find the following alternatives `getByOuia`, `getAllByOuia`, `queryByOuia` and `queryAllByOuia` and they will
behave as you would expect in the [testing Library](https://testing-library.com/).
The only missing selectors are `findByOuia` and `findAllByOuia`. [PRs are welcome!](https://github.com/RedHatInsights/frontend-components/compare).

Below are some examples, but more can be found on the [tests](../src/OuiaSelectors/OuiaSelectors.test.tsx).

## Standalone example

```typescript
expect(
    ouiaSelectors.getByOuia('PF4/Select')
).toBeVisible();
```

## Using events from `@testing-library`

```typescript
userEvent.click(
    ouiaSelectors.getByOuia('PF4/Button', 'action')
);
```

## Mixing with calls of the `@testing-library`
```typescript
expect(
  getByLabelText(
      ouiaSelectors.getByOuia('Notifications/Integrations/Table'), 
      /Enabled/i
  )
).toBeDisabled();
```
