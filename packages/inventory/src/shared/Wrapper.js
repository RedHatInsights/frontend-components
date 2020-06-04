import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';

class RenderWrapper extends Component {
    render() {
        const { inventoryRef, cmp: Component, store, ...props } = this.props;
        return store ?
            <Provider store={store}>
                <Component
                    {...props}
                    { ...inventoryRef && {
                        ref: inventoryRef
                    }}
                />
            </Provider> :
            <Component
                {...props}
                { ...inventoryRef && {
                    ref: inventoryRef
                }}
            />;
    }
}

RenderWrapper.propTypes = {
    cmp: PropTypes.oneOfType([ PropTypes.func, PropTypes.string, PropTypes.element ]),
    inventoryRef: PropTypes.any,
    store: PropTypes.object
};

export default RenderWrapper;
