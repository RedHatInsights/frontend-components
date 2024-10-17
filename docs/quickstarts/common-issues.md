# Common issues with quickstarts

## Fixing modals that overlay quickstarts

By default, modals will be appended to the root which interferes (z-axis shenanigans) with the quickstarts drawer rendering them useless. To get around this, we'll use the `appendTo` prop for our modals by appending it to `pf-c-page.chr-c-page` instead of the root.

For example,
```jsx
const appendTo = React.useMemo(() => document.querySelector('.pf-c-page.chr-c-page'), []);

return (
  <Modal isOpen modalVariant={ModalVariant.large} hasNoBodyWrapper appendTo={appendTo} showClose={false}></Modal>
);
```

If you have, say, a `<Wizard />` that's being returned, you can simply wrap it with the `appendTo` modal,

```jsx
const appendTo = React.useMemo(() => document.querySelector('.pf-c-page.chr-c-page'), []);

return (
  <Modal isOpen modalVariant={ModalVariant.large} hasNoBodyWrapper appendTo={appendTo} showClose={false}>
    <Wizard />
  </Modal>
);
```

Use [this PR](https://github.com/RedHatInsights/sources-ui/pull/1076/files) as reference for appending the model to the correct element.
