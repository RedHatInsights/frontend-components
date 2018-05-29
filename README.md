[![Build Status](https://travis-ci.org/RedHatInsights/insights-frontend-starter-app.svg?branch=master)](https://travis-ci.org/RedHatInsights/insights-frontend-starter-app)

# insights-frontend-starter-app
React.js starter app for Red Hat Insights products that includes Patternfly 3 and Patternfly Next.

# Build app
1. ```npm install```

2. ```npm run start```
    - starts webpack bundler and serves the files with webpack dev server

### Testing
- Travis is used to test the build for this code.
    - `npm test` will run the test

# Patternfly
- This project imports Patternfly components:
    - [Patternfly React](https://github.com/patternfly/patternfly-react)
    - [Patternfly Next](https://github.com/patternfly/patternfly-next)
        - Because PF-Next is not react based, there is an example on how to use [classnames](https://github.com/JedWatson/classnames) in the [Button component](https://github.com/RedHatInsights/insights-frontend-starter-app/blob/master/src/PresentationalComponents/Button/button.js) and how to apply classes dynamically.
        
# Insights Components
Insights Platform will deliver components and static assets through npm (TBD). ESI tags are used to import the [chroming](https://github.com/RedHatInsights/insights-chrome) which takes care of the header, sidebar, and footer.

# Technologies
## Webpack
### Webpack.config.js
This file exports an object with the configuration for webpack and webpack dev server.

```Javascript
{
    mode: https://webpack.js.org/concepts/mode/,
    devtool: https://webpack.js.org/configuration/devtool/,
    
    // different bundle options.
    // allows you to completely separate vendor code from app code and much more. 
    // https://webpack.js.org/plugins/split-chunks-plugin/
    optimization: {
        chunks: https://webpack.js.org/plugins/split-chunks-plugin/#optimization-splitchunks-chunks-all,
        runtimeChunk: https://webpack.js.org/plugins/split-chunks-plugin/#optimization-runtimechunk,
        
        // https://webpack.js.org/plugins/split-chunks-plugin/#configuring-cache-groups
        cacheGroups: {
            
            // bundles all vendor code needed to run the entry file
            common_initial: {
                test: // file regex: /[\\/]node_modules[\\/]/,
                name: // filename: 'common.initial',
                chunks: // chunk type initial, async, all
            }
        }
    },
    
    // each property of entry maps to the name of an entry file 
    // https://webpack.js.org/concepts/entry-points/
    entry: {
        
        // example bunde names
        bundle1: 'src/entry1.js',
        bundle2: 'src/entry2.js'
    },
    
    // bundle output options.
    output: {
            filename: https://webpack.js.org/configuration/output/#output-filename,
            path: https://webpack.js.org/configuration/output/#output-path,
            publicPath: https://webpack.js.org/configuration/output/#output-publicpath,
            chunkFilename: https://webpack.js.org/configuration/output/#output-chunkfilename
    },
     module: {
         rules: https://webpack.js.org/configuration/module/#module-rules
     },
     
     // An array of webpack plugins look at webpack.plugins.js
     // https://webpack.js.org/plugins/
     plugins: [],
     
     // webpack dev serve options
     // https://github.com/webpack/webpack-dev-server
     devServer: {}
}
```

## React
- High-Order Component
    - a higher-order component is a function that takes a component and returns a new component
    - https://reactjs.org/docs/higher-order-components.html
    - Ex) [asyncComponent.js](https://github.com/RedHatInsights/insights-frontend-starter-app/src/Utils/asyncComponent.js)
    
- Smart/Presentational Components
    - https://medium.com/@thejasonfile/dumb-components-and-smart-components-e7b33a698d43
    - Smart components have access to the redux state
    - Presentational components do not have access to the redux state
    - Smart Components === insights-frontend/app/js/states
    - Presentational Components === insights-frontend/app/js/components
    
    
- State and lifecycle within class components
    - https://reactjs.org/docs/state-and-lifecycle.html
    - article contains:
        - Adding Lifecycle Methods to a Class
        - Adding Local State to a Class
        - State Updates May Be Asynchronous
        - State Updates are Merged

## Redux
### Store
A store holds the whole [state tree](https://redux.js.org/glossary) of your application.
Redux doesn't have a Dispatcher or support many stores. Instead, there is just a single store with a single root reducing function.

https://redux.js.org/basics/store

```createStore(reducer, preloadedState, enhancer)```: https://redux.js.org/api-reference/createstore

- methods
    - [getState()](https://redux.js.org/api-reference/store#dispatch)
    - [dispatch(action)](https://redux.js.org/api-reference/store#dispatch)
    - [subscribe(listener)](https://redux.js.org/api-reference/store#subscribe)
    - [replaceReducer(nextReducer)](https://redux.js.org/api-reference/store#replaceReducer)
    
### actions
Actions are payloads of information that send data from your application to your store. They are the only source of information for the store. You send them to the store using [store.dispatch()](https://redux.js.org/api-reference/store#dispatch).
Redux actions should only have two properties, type and payload, as a best practice.

https://redux.js.org/basics/actions
 - Async Actions frameworks
    - [redux-promise-middleware](https://github.com/pburtchaell/redux-promise-middleware)
        - Currently using this
        - look at [/src/api/System/getSystems.js](https://github.com/RedHatInsights/turbo-octo-couscous/tree/master/src/api/System/getSystems.js)
    - [redux-thunk](https://github.com/gaearon/redux-thunk)
       - A function that wraps an expression to delay its evaluation
       ```Javascript
       // gotSystems(Error) are action creators
       function getSystems() {      
            return function (dispatch) {
              return fetchSystems().then(
                systems => dispatch(gotSystems(systems)),
                error => dispatch(gotSystemsError(error))
              );
            };
          }
       ```
    - [redux-saga](https://github.com/yelouafi/redux-saga/)
        - Uses [generator functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*)
        - Could be a lot to learn initially.
    - [redux-pack](https://github.com/lelandrichardson/redux-pack)

### Reducers
Reducers specify how the application's state changes in response to actions sent to the store.

https://redux.js.org/basics/reducers

Ex) [/src/api/System/getSystems.js](https://github.com/RedHatInsights/turbo-octo-couscous/tree/master/src/api/System/getSystems.js)

## React-redux
- [Provider](https://github.com/reactjs/react-redux/blob/master/docs/api.md#provider-store)
    - Makes the Redux store available to the connect()
- [connect([mapStateToProps], [mapDispatchToProps], [mergeProps], [options])](https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options)
    - Connects a React component to a Redux store

## React-router-dom
When setting up the routes, the page content is wrapped with a `.page__{pageName}` class, applied to the `#root` ID that is determined by the `rootClass` in the `Routes.js` which lets you easily reference the page in the styling.

- [BrowserRouter](https://reacttraining.com/react-router/web/api/BrowserRouter)
    - A <Router> that uses the HTML5 history API (pushState, replaceState and the popstate event) to keep your UI in sync with the URL
- [Route](https://reacttraining.com/react-router/web/api/Route)
- [Switch](https://reacttraining.com/react-router/web/api/Switch)
    - Renders the first child <Route> or <Redirect> that matches the location.
- [Redirect](https://reacttraining.com/react-router/web/api/Redirect)
    - navigate to a new location
- [withRouter](https://reacttraining.com/react-router/web/api/withRouter)
    - passes updated match, location, and history props to the wrapped component whenever it renders
