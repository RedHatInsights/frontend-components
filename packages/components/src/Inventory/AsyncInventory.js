import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import * as ReactRedux from 'react-redux';
import * as pfReactTable from '@patternfly/react-table';
import * as reactRouterDom from 'react-router-dom';
import { reactCore } from '@redhat-cloud-services/frontend-components-utilities/inventoryDependencies';
import { useStore } from 'react-redux';

const AsyncInventory = ({ fallback, onLoad, innerRef, component, ...props }) => {
    const store = useStore();
    const [ InvCmp, setInvCmp ] = useState();
    useEffect(() => {
        (async () => {
            const { inventoryConnector, ...rest } = await insights.loadInventory({
                ReactRedux, react: React, reactRouterDom, pfReactTable, pfReact: reactCore
            });

            onLoad(rest);

            const { [component]: InvComponent } = inventoryConnector(store);

            setInvCmp(() =>  InvComponent);
        })();
    }, []);

    return InvCmp ? <InvCmp ref={innerRef} {...props} /> : fallback || <Fragment />;
};

AsyncInventory.propTypes = {
    fallback: PropTypes.any,
    onLoad: PropTypes.func,
    component: PropTypes.string,
    innerRef: PropTypes.object
};

AsyncInventory.defaultProps = {
    onLoad: () => undefined,
    component: ''
};

export default AsyncInventory;
