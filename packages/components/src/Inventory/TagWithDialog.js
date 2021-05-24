import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
const AsyncInventory = React.lazy(() => import('./AsyncInventory'));
import { ScalprumComponent } from '@scalprum/react-core';
import { useHistory } from 'react-router-dom';
import { useStore } from 'react-redux';
import { Bullseye, Spinner } from '@patternfly/react-core';

/**
 * Inventory sub component.
 *
 * This component is used to manipulate with inventory tags.
 */
const BaseTagWithDialog = (props) => {
    const history = useHistory();
    const store = useStore();
    return (
        <Suspense fallback={props.fallback}>
            <ScalprumComponent
                history={history}
                store={store}
                appName="chrome"
                module="./TagWithDialog"
                scope="chrome"
                ErrorComponent={<AsyncInventory component="TagWithDialog" {...props} />}
                ref={props.innerRef}
                {...props}
            />
        </Suspense>
    );
};

BaseTagWithDialog.propTypes = {
    fallback: PropTypes.node,
    innerRef: PropTypes.object
};

/**
 * Inventory sub component.
 *
 * This component shows systems table connected to redux.
 */
const TagWithDialog = React.forwardRef((props, ref) => <BaseTagWithDialog innerRef={ref} {...props} />);

TagWithDialog.propTypes = {
    /** React Suspense fallback component. <a href="https://reactjs.org/docs/code-splitting.html#reactlazy" target="_blank">Learn more</a>. */
    fallback: PropTypes.node
};

TagWithDialog.defaultProps = {
    fallback: <Bullseye className="pf-u-p-lg"><Spinner size="xl" /></Bullseye>
};

export default TagWithDialog;
