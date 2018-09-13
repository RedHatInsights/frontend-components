# Redux
We provide some improvements over redux so projects using this package can use redux to it's full.

## Middleware listener
Because there are places where creating new reducer is too robust and might lead to wrong state mutation there is middleware which can create listeners on redux actions. Anytime new action is triggered it looks trough this set of listeners and calls callbacks.

#### Usage of middleware listener
```javascript
import { applyMiddleware } from 'redux';
import { MiddlewareListener } from '@red-hat-insights/insights-frontend-components';
const listenerMiddleware = new MiddlewareListener();
this.store = createStore(
    reducers,
    initState,
    applyMiddleware(listenerMiddleware.getMiddleware())
);
```

After creating such listener middleware you can simply call `addNew` method with type over which you want to listen and callback that is called when such action is called on redux.

addNew params:
* on - type of action to listen to
* callback - function that is called when action is triggered

Callback params:
* data - payload from action
* preventBubble - function to prevent bubbling of such redux event. New event is triggered with type `@@config/action-stopped` and payload as action that was stopped.
```javascript
const removeListener = listenerMiddleware.addNew({on: 'someType', (event) => event.preventBubble()})
```

Please clean after yourself by calling function which is returned from `listenerMiddleware`.
## Reducer registry
To enable registering reducers on the fly you may use reducer registry. There are also helper functions to help you improve your work with redux.

### Registry decorator
To use registry out of the box without some kind of coding we provide simple decorator
(you'd have to install coresponding babel [plugin](http://babeljs.io/docs/en/babel-plugin-transform-decorators) and enable decorators).

 * First you have to initialize such registry by calling `getStoreFromRegistry` with initial state and some middlewares
(both attributes are optional).
```JSX
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { getStoreFromRegistry } from '@red-hat-insights/insights-frontend-components';
import promiseMiddleware from 'redux-promise-middleware';
import App from './App';

ReactDOM.render(
    <Provider store={getStoreFromRegistry({}, [promiseMiddleware()])}>
        <Router basename='/insights/platform/inventory'>
            <App />
        </Router>
    </Provider>,
    document.getElementById('root')
);

```

 * Then you can use this decorator anywhere you want and you can access registry by calling `this.registry`.

 ```JSX
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { registry as registryDecorator } from '@red-hat-insights/insights-frontend-components';

//We'll bind registry to this class
@registryDecorator()
class SomeClass extends Component {

    componentDidMount () {
        //we'll register new reducer over here
        this.registry.register({
            someKey: (state, action) => ({...state})
        })
    }

    render () {
        return (
        <div>
            Hello world
        </div>
        );
    }
}

export default connect()(App);
```

#### Usage of reducer registry
Simply create new instance of reducer registry, you may wish to supply some parameters while creating new store so you 
can change behaviour of your state.

Parameters:
* `initState` - default to empty object
* `middlewares` - default to empty array
* `composeEnhancers` - default to `compose` from redux library

```javascript
import { ReducerRegistry } from '@red-hat-insights/insights-frontend-components';
import { middlewares } from './middlewareSettings';

const reduxRegistry = new ReducerRegistry(initState, middlewares);
```

Available methods:
* `getStore` - to dispatch or to read state of store
* `register` - to add multiple reducers

### Helper function
#### `applyReducerHash`
If you don't like switch statements in your reducers you may use object literals, this function will map such object to
reducer
```javascript
const SOME_ACTION = 'some-action';
function reducerFunction(state, action) {
    return {
        ...state,
        someProps: action.payload
    };
}

const customReducer = applyReducerHash({
    [SOME_ACTION]: reducerFunction
})
```

Later you can assign this `customReducer` to change the store by calling `register` function.

#### `dispatchActionsToStore`
If application has some actions which needs to be dispatched over multiple stores or they can't be connected via `redux-redux` it's convenient to use this function.

It's as easy as calling dispatchActionsToStore with multiple actions (either trough object or array) and store over which you want to dispatch these functions.
```javascript
import * as actions from './actions';
import store from './singleton-store';
import { dispatchActionsToStore } from '@red-hat-insights/insights-frontend-components';

export default dispatchActionsToStore(actions, store);
```
