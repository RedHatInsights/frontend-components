import React, { type JSX, Suspense } from 'react';
import { ScalprumComponent, ScalprumComponentProps } from '@scalprum/react-core';
import { useStore } from 'react-redux';
import { Bullseye } from '@patternfly/react-core/dist/dynamic/layouts/Bullseye';
import { Spinner } from '@patternfly/react-core/dist/dynamic/components/Spinner';
import InventoryLoadError from './InventoryLoadError';
import classNames from 'classnames';
import WithHistory from './WithHistory';
import { History } from 'history';

interface BaseInvTableProps extends Record<string, unknown> {
  fallback?: React.ReactNode;
  innerRef?: React.Ref<unknown>;
  component?: keyof JSX.IntrinsicElements;
  className?: string;
  history?: History;
}

const BaseInvTable = ({
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
}: BaseInvTableProps) => {
  const store = useStore();
  const Component = component;
  const SCProps: ScalprumComponentProps<{}, Record<string, unknown>> = {
    history,
    store,
    appName: 'inventory',
    module: './InventoryTable',
    scope: 'inventory',
    ErrorComponent: <InventoryLoadError component="InventoryTable" {...props} />,
    ref: innerRef,
    fallback,
    ...props,
  };
  return (
    <Component className={classNames(className, 'inventory')}>
      <Suspense fallback={fallback}>
        <ScalprumComponent {...SCProps} />
      </Suspense>
    </Component>
  );
};

export interface InventoryTableProps extends Record<string, unknown> {
  /** React Suspense fallback component. <a href="https://reactjs.org/docs/code-splitting.html#reactlazy" target="_blank">Learn more</a>. */
  fallback?: React.ReactNode;
  /** Optional wrapper component */
  component?: keyof JSX.IntrinsicElements;
  /** Optional classname applied to wrapper component */
  className?: string;
}

/**
 * Inventory sub component.
 *
 * This component shows systems table connected to redux.
 */
const InvTable = React.forwardRef<unknown, InventoryTableProps>((props, ref) => <BaseInvTable innerRef={ref} {...props} />);

InvTable.displayName = 'InvTable';

const CompatibilityWrapper = React.forwardRef<unknown, InventoryTableProps>((props, ref) => (
  <WithHistory innerRef={ref} Component={InvTable} {...props} />
));

CompatibilityWrapper.displayName = 'InvTableCompatibilityWrapper';

export default CompatibilityWrapper;
