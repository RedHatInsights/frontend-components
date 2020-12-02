import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
const AsyncInventory = React.lazy(() => import('./AsyncInventory'));
import { ScalprumComponent } from '@scalprum/react-core';
import { useHistory } from 'react-router-dom';
import { useStore } from 'react-redux';

const InventoryDetailHead = ({ fallback, ...props }) => {
    const history = useHistory();
    const store = useStore();
    return <ScalprumComponent
        history={history}
        store={store}
        fallback={fallback}
        appName="chrome"
        module="./InventoryDetailHead"
        scope="chrome"
        ErrorComponent={() => <Suspense fallback={fallback}>
            <AsyncInventory
                component="InventoryDetailHead"
                {...props}
                fallback={fallback} />
        </Suspense>}
        {...props}
    />;
};

InventoryDetailHead.propTypes = {
    fallback: PropTypes.any
};

export default React.forwardRef((props, ref) => <InventoryDetailHead {...props} ref={ref} />);
