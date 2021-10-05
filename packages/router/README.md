# Do not use this package yet. It is still in an experimental phase and might be removed.

# Chrome routing package

## Before you use!

This package is just a simple wrapper around `react-router-dom` components and functions. Its only purpose is to prepend paths with the current router `basename` prop. For example, in internal inventory Link, it will transform `to` prop based on the router basename:

```jsx

<BrowserRouter basename="/insights/inventory">
...
</BrowserRouter>


/**
 * Link code
*/
<Link to="/systems" someProp="foo" />

/**
 * Link injected into VirtualDOM
*/
<Link to="/insights/inventory/systems" someProp="foo" />

```

Before useing this package, please consider updating your links and routes to `/<basename>/original/path`. You don't have to play with the `/beta` partial.! That is included in the shared history.

## Why?
In the future, chrome and applications should use the same history instance to improve routing between applications without using the chrome left nav. This package will help with migration over to the shared history.
