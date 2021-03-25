import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
const AsyncInventory = React.lazy(() => import('./AsyncInventory'));
import { ScalprumComponent } from '@scalprum/react-core';
import { useHistory } from 'react-router-dom';
import { useStore } from 'react-redux';
import { Bullseye, Spinner } from '@patternfly/react-core';

const BaseInvTable = (props) => {
    const history = useHistory();
    const store = useStore();
    return (
        <Suspense fallback={props.fallback}>
            <ScalprumComponent
                history={history}
                store={store}
                appName="chrome"
                module="./InventoryTable"
                scope="chrome"
                ErrorComponent={<AsyncInventory component="InventoryTable" {...props} />}
                ref={props.innerRef}
                {...props}
            />
        </Suspense>
    );
};

/**
 * Inventory sub component.
 *
 * This component shows systems table connected to redux.
 */
const InvTable = React.forwardRef((props, ref) => <BaseInvTable innerRef={ref} {...props} />);

InvTable.propTypes = {
    /** React Suspense fallback component. <a href="https://reactjs.org/docs/code-splitting.html#reactlazy" target="_blank">Learn more</a>. */
    fallback: PropTypes.node
};

InvTable.defaultProps = {
    fallback: <Bullseye className="pf-u-p-lg"><Spinner size="xl" /></Bullseye>
};

export default InvTable;
