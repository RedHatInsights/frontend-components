import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
const AsyncInventory = React.lazy(() => import('./AsyncInventory'));
import { ScalprumComponent } from '@scalprum/react-core';
import { useHistory } from 'react-router-dom';
import { useStore } from 'react-redux';
import { Bullseye, Spinner } from '@patternfly/react-core';

const DetailWrapper = React.forwardRef((props, ref) => {
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
                ErrorComponent={<AsyncInventory ref={ref} component="DetailWrapper" {...props} />}
                ref={ref}
                {...props}
            />
        </Suspense>
    );
});

DetailWrapper.propTypes = {
    fallback: PropTypes.node
};

DetailWrapper.defaultProps = {
    fallback: <Bullseye><Spinner size="xl" /></Bullseye>
};

export default DetailWrapper;
