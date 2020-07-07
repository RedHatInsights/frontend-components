import React from 'react';
import PropTypes from 'prop-types';

console.log('fff');

const RenderWrapper = ({ cmp: Component, inventoryRef, store, ...props }) => (
    <Component
        {...props}
        { ...inventoryRef && {
            ref: inventoryRef
        }}
        store={ store }
    />
);

RenderWrapper.propTypes = {
    cmp: PropTypes.any,
    inventoryRef: PropTypes.any,
    store: PropTypes.object,
    customRender: PropTypes.bool
};

export default RenderWrapper;
