import React, { Suspense, type JSX } from 'react';
import { ScalprumComponent } from '@scalprum/react-core';
import { useStore } from 'react-redux';
import { Bullseye } from '@patternfly/react-core/dist/dynamic/layouts/Bullseye';
import { Spinner } from '@patternfly/react-core/dist/dynamic/components/Spinner';
import InventoryLoadError from './InventoryLoadError';
import classNames from 'classnames';
import WithHistory from './WithHistory';

interface BaseInvTableProps {
  fallback?: React.ReactNode;
  innerRef?: React.Ref<HTMLElement>;
  component?: string;
  className?: string;
  history?: any;
}

const BaseInvTable: React.FC<BaseInvTableProps> = ({
  fallback = (
    <Bullseye className="pf-v6-u-p-lg">
      <Spinner size="xl" aria-label="Loading" />
    </Bullseye>
  ),
  component = 'section',
  className,
  history,
  innerRef,
  ...props
}) => {
  const store = useStore();
  const Component = component as keyof JSX.IntrinsicElements;
  return (
    <Component className={classNames(className, 'inventory')}>
      <Suspense fallback={fallback}>
        <ScalprumComponent
          history={history}
          store={store}
          appName="inventory"
          module="./InventoryTable"
          scope="inventory"
          ErrorComponent={<InventoryLoadError component="InventoryTable" {...props} />}
          ref={innerRef}
          {...props}
        />
      </Suspense>
    </Component>
  );
};

export interface InventoryTableProps {
  /** React Suspense fallback component. <a href="https://reactjs.org/docs/code-splitting.html#reactlazy" target="_blank">Learn more</a>. */
  fallback?: React.ReactNode;
  /** Optional wrapper component */
  component?: string;
  /** Optional classname applied to wrapper component */
  className?: string;
}

/**
 * Inventory sub component.
 *
 * This component shows systems table connected to redux.
 */
const InvTable = React.forwardRef<HTMLElement, InventoryTableProps>((props, ref) => (
  <BaseInvTable innerRef={ref} {...props} />
));

InvTable.displayName = 'InvTable';

const CompatibilityWrapper = React.forwardRef<HTMLElement, InventoryTableProps>((props, ref) => (
  <WithHistory innerRef={ref} Component={InvTable} {...props} />
));

CompatibilityWrapper.displayName = 'InvTableCompatibilityWrapper';

export default CompatibilityWrapper;
