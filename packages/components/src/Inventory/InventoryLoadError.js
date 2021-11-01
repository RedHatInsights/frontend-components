import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

const InventoryLoadError = ({ component, ...props }) => {
    useEffect(() => {
        console.error(`Unable to load inventory component. Failed to load ${component}.`, props);
    }, []);
    return (
        <div>
            <h1>Unable to load inventory component</h1>
            <h2>Failed to load {component}</h2>
            <code>
                More info can be found in browser console output.
            </code>
        </div>
    );
};

InventoryLoadError.propTypes = {
    component: PropTypes.string
};

export default InventoryLoadError;
