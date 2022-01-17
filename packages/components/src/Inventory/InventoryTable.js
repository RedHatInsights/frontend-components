import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
import { ScalprumComponent } from '@scalprum/react-core';
import { useHistory } from 'react-router-dom';
import { useStore } from 'react-redux';
import { Bullseye, Spinner } from '@patternfly/react-core';
import InventoryLoadError from './InventoryLoadError';

const BaseInvTable = (props) => {
  const history = useHistory();
  const store = useStore();
  return (
    <Suspense fallback={props.fallback}>
      <ScalprumComponent
        history={history}
        store={store}
        appName="inventory"
        module="./InventoryTable"
        scope="inventory"
        ErrorComponent={<InventoryLoadError component="InventoryDetailHead" history={history} store={store} {...props} />}
        ref={props.innerRef}
        {...props}
      />
    </Suspense>
  );
};

BaseInvTable.propTypes = {
  fallback: PropTypes.node,
  innerRef: PropTypes.object,
};

/**
 * Inventory sub component.
 *
 * This component shows systems table connected to redux.
 */
const InvTable = React.forwardRef((props, ref) => <BaseInvTable innerRef={ref} {...props} />);

InvTable.propTypes = {
  /** React Suspense fallback component. <a href="https://reactjs.org/docs/code-splitting.html#reactlazy" target="_blank">Learn more</a>. */
  fallback: PropTypes.node,
};

InvTable.defaultProps = {
  fallback: (
    <Bullseye className="pf-u-p-lg">
      <Spinner size="xl" />
    </Bullseye>
  ),
};

export default InvTable;
