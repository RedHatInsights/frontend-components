import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
const AsyncInventory = React.lazy(() => import('./AsyncInventory'));
import { ScalprumComponent } from '@scalprum/react-core';
import { useHistory } from 'react-router-dom';
import { useStore } from 'react-redux';

const InventoryDetail = ({ fallback, ...props }) => {
    const history = useHistory();
    const store = useStore();
    return <ScalprumComponent
        history={history}
        store={store}
        fallback={fallback}
        appName="chrome"
        module="./InventoryDetail"
        scope="chrome"
        ErrorComponent={() => <Suspense fallback={fallback}>
            <AsyncInventory
                component="InventoryDetail"
                {...props}
                fallback={fallback} />
        </Suspense>}
        {...props}
    />;
};

InventoryDetail.propTypes = {
    fallback: PropTypes.any
};

export default React.forwardRef((props, ref) => <InventoryDetail {...props} ref={ref} />);
