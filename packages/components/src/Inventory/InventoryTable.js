import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
import { ScalprumComponent } from '@scalprum/react-core';
import { useStore } from 'react-redux';
import { Bullseye } from '@patternfly/react-core/dist/dynamic/layouts/Bullseye';
import { Spinner } from '@patternfly/react-core/dist/dynamic/components/Spinner';
import InventoryLoadError from './InventoryLoadError';
import classNames from 'classnames';
import WithHistory from './WithHistory';

const BaseInvTable = (props) => {
  const store = useStore();
  const Cmp = props.component;
  return (
    <Cmp className={classNames(props.className, 'inventory')}>
      <Suspense fallback={props.fallback}>
        <ScalprumComponent
          history={props.history}
          store={store}
          appName="inventory"
          module="./InventoryTable"
          scope="inventory"
          ErrorComponent={<InventoryLoadError component="InventoryDetailHead" {...props} />}
          ref={props.innerRef}
          {...props}
        />
      </Suspense>
    </Cmp>
  );
};

BaseInvTable.propTypes = {
  fallback: PropTypes.node,
  innerRef: PropTypes.object,
  component: PropTypes.string,
  className: PropTypes.string,
  history: PropTypes.object,
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
  /** Optional wrapper component */
  component: PropTypes.string,
  /** Optional classname applied to wrapper component */
  className: PropTypes.string,
};

InvTable.defaultProps = {
  fallback: (
    <Bullseye className="pf-v6-u-p-lg">
      <Spinner size="xl" />
    </Bullseye>
  ),
  component: 'section',
};

const CompatiblityWrapper = (props, ref) => <WithHistory innerRef={ref} Component={InvTable} {...props} />;

export default React.forwardRef(CompatiblityWrapper);
