import React, { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
class RenderWrapper extends PureComponent {
    ref = createRef();

    render() {
        console.log(React, 'Inventory react');
        const { cmp: Component, inventoryRef, store, ...props } = this.props;
        return store ?
            <Provider store={store}>
                <div>aaa</div>
            </Provider> :
            <Component
                {...props}
                { ...inventoryRef && {
                    ref: inventoryRef
                }}
                store={ store }
            />;
    }
}

RenderWrapper.propTypes = {
    cmp: PropTypes.any,
    inventoryRef: PropTypes.any,
    store: PropTypes.object,
    customRender: PropTypes.bool
};

export default RenderWrapper;
