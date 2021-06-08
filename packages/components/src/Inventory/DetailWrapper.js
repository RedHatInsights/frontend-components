import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
const AsyncInventory = React.lazy(() => import('./AsyncInventory'));
import { ScalprumComponent } from '@scalprum/react-core';
import { useHistory } from 'react-router-dom';
import { useStore } from 'react-redux';
import { Bullseye, Spinner } from '@patternfly/react-core';

const BaseDetailWrapper = (props) => {
    const history = useHistory();
    const store = useStore();
    return (
        <Suspense fallback={props.fallback}>
            <ScalprumComponent
                history={history}
                store={store}
                appName="chrome"
                module="./DetailWrapper"
                scope="chrome"
                ErrorComponent={<AsyncInventory component="DetailWrapper" {...props} />}
                ref={props.innerRef}
                {...props}
            />
        </Suspense>
    );
};

BaseDetailWrapper.propTypes = {
    fallback: PropTypes.node,
    innerRef: PropTypes.object
};

/**
 * Inventory sub component.
 *
 * This component wraps entire system detail in order to show loading state and drawer (if enabled).
 */
const DetailWrapper = React.forwardRef((props, ref) => <BaseDetailWrapper innerRef={ref} {...props} />);

DetailWrapper.propTypes = {
    /** React Suspense fallback component. <a href="https://reactjs.org/docs/code-splitting.html#reactlazy" target="_blank">Learn more</a>. */
    fallback: PropTypes.node
};

DetailWrapper.defaultProps = {
    fallback: <Bullseye className="pf-u-p-lg"><Spinner size="xl" /></Bullseye>
};

export default DetailWrapper;
