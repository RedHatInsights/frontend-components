import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
const AsyncInventory = React.lazy(() => import('./AsyncInventory'));
import { ScalprumComponent } from '@scalprum/react-core';
import { useHistory } from 'react-router-dom';
import { useStore } from 'react-redux';
import { Bullseye, Spinner } from '@patternfly/react-core';

const BaseInventoryDetailHead = (props) => {
    const history = useHistory();
    const store = useStore();
    return (
        <Suspense fallback={props.fallback}>
            <ScalprumComponent
                history={history}
                store={store}
                appName="chrome"
                module="./InventoryDetailHead"
                scope="chrome"
                ErrorComponent={<AsyncInventory component="InventoryDetailHead" {...props} />}
                ref={props.innerRef}
                {...props}
            />
        </Suspense>
    );
};

BaseInventoryDetailHead.propTypes = {
    fallback: PropTypes.node,
    innerRef: PropTypes.object
};

/**
 * Inventory sub component.
 *
 * This component shows system information (tags, facts and basic operations).
 */
const InventoryDetailHead = React.forwardRef((props, ref) => <BaseInventoryDetailHead innerProps={ref} {...props} />);

InventoryDetailHead.propTypes = {
    /** React Suspense fallback component. <a href="https://reactjs.org/docs/code-splitting.html#reactlazy" target="_blank">Learn more</a>. */
    fallback: PropTypes.node
};

InventoryDetailHead.defaultProps = {
    fallback: <Bullseye className="pf-u-p-lg"><Spinner size="xl" /></Bullseye>
};

export default InventoryDetailHead;
