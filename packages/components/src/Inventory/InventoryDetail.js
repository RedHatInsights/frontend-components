import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
const AsyncInventory = React.lazy(() => import('./AsyncInventory'));
import { ScalprumComponent } from '@scalprum/react-core';
import { useHistory } from 'react-router-dom';
import { useStore } from 'react-redux';
import { Bullseye, Spinner } from '@patternfly/react-core';

const BaseInventoryDetail = (props) => {
    const history = useHistory();
    const store = useStore();
    return (
        <Suspense fallback={props.fallback}>
            <ScalprumComponent
                history={history}
                store={store}
                appName="chrome"
                module="./InventoryDetail"
                scope="chrome"
                ErrorComponent={<AsyncInventory component="InventoryDetail" {...props} />}
                ref={props.innerRef}
                {...props}
            />
        </Suspense>
    );
};

BaseInventoryDetail.propTypes = {
    fallback: PropTypes.node,
    innerRef: PropTypes.object
};

/**
 * Inventory sub component.
 *
 * This component shows complete inventory detail with system info and app's detail in tab(s).
 */
const InventoryDetail = React.forwardRef((props, ref) => <BaseInventoryDetail innerRef={ref} {...props} />);

InventoryDetail.propTypes = {
    /** React Suspense fallback component. <a href="https://reactjs.org/docs/code-splitting.html#reactlazy" target="_blank">Learn more</a>. */
    fallback: PropTypes.node
};

InventoryDetail.defaultProps = {
    fallback: <Bullseye className="pf-u-p-lg"><Spinner size="xl" /></Bullseye>
};

export default InventoryDetail;
