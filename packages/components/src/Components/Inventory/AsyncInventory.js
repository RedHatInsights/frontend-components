import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import * as ReactRedux from 'react-redux';
import * as pfReactTable from '@patternfly/react-table';
import * as reactRouterDom from 'react-router-dom';
import { reactCore } from '@redhat-cloud-services/frontend-components-utilities/files/inventoryDependencies';
import { useStore } from 'react-redux';

const AsyncInventory = ({ fallback, onLoad, component, ...props }) => {
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

    return InvCmp ? <InvCmp {...props} /> : fallback || <Fragment />;
};

AsyncInventory.propTypes = {
    fallback: PropTypes.any,
    onLoad: PropTypes.func,
    component: PropTypes.string
};

export default React.forwardRef((props, ref) => <AsyncInventory {...props} ref={ref}/>);
