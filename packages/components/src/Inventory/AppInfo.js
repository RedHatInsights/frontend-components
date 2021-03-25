import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
const AsyncInventory = React.lazy(() => import('./AsyncInventory'));
import { ScalprumComponent } from '@scalprum/react-core';
import { useHistory } from 'react-router-dom';
import { useStore } from 'react-redux';
import { Bullseye, Spinner } from '@patternfly/react-core';

const BaseAppInfo = (props) => {
    const history = useHistory();
    const store = useStore();
    return (
        <Suspense fallback={props.fallback}>
            <ScalprumComponent
                history={history}
                store={store}
                appName="chrome"
                module="./AppInfo"
                scope="chrome"
                ErrorComponent={<AsyncInventory component="AppInfo" {...props} />}
                ref={props.innerRef}
                {...props}
            />
        </Suspense>
    );
};

/**
 * Inventory sub component.
 *
 * This component shows tab(s) with detail information about selected system.
 */
const AppInfo = React.forwardRef((props, ref) => <BaseAppInfo innerRef={ref} {...props} />);

AppInfo.propTypes = {
    /** React Suspense fallback component. <a href="https://reactjs.org/docs/code-splitting.html#reactlazy" target="_blank">Learn more</a>. */
    fallback: PropTypes.node
};

AppInfo.defaultProps = {
    fallback: <Bullseye className="pf-u-p-lg"><Spinner size="xl" /></Bullseye>
};

export default AppInfo;
