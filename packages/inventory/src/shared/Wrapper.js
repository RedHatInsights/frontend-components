import React, { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';

class RenderWrapper extends PureComponent {
    ref = createRef();

    render() {
        const { cmp: Component, inventoryRef, store, ...props } = this.props;
        return <Component
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
