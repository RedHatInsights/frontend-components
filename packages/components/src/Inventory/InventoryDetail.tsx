import React, { Suspense, type JSX } from 'react';
import { ScalprumComponent } from '@scalprum/react-core';
import { useStore } from 'react-redux';
import { Bullseye } from '@patternfly/react-core/dist/dynamic/layouts/Bullseye';
import { Spinner } from '@patternfly/react-core/dist/dynamic/components/Spinner';
import InventoryLoadError from './InventoryLoadError';
import classNames from 'classnames';
import WithHistory from './WithHistory';

interface BaseInventoryDetailProps {
  fallback?: React.ReactNode;
  innerRef?: React.Ref<any>;
  component?: string;
  className?: string;
  history?: any;
}

const BaseInventoryDetail: React.FC<BaseInventoryDetailProps> = ({
  fallback = (
    <Bullseye className="pf-v6-u-p-lg">
      <Spinner size="xl" />
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
          module="./InventoryDetail"
          scope="inventory"
          ErrorComponent={<InventoryLoadError component="InventoryDetailHead" {...props} />}
          ref={innerRef}
          {...props}
        />
      </Suspense>
    </Component>
  );
};

export interface InventoryDetailProps {
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
 * This component shows complete inventory detail with system info and app's detail in tab(s).
 */
const InventoryDetail = React.forwardRef<any, InventoryDetailProps>((props, ref) => (
  <BaseInventoryDetail innerRef={ref} {...props} />
));

InventoryDetail.displayName = 'InventoryDetail';

const CompatibilityWrapper = React.forwardRef<any, InventoryDetailProps>((props, ref) => (
  <WithHistory innerRef={ref} Component={InventoryDetail} {...props} />
));

CompatibilityWrapper.displayName = 'InventoryDetailCompatibilityWrapper';

export default CompatibilityWrapper;
