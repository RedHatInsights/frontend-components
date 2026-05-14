import React, { Suspense, type JSX } from 'react';
import { ScalprumComponent } from '@scalprum/react-core';
import { useStore } from 'react-redux';
import { Bullseye } from '@patternfly/react-core/dist/dynamic/layouts/Bullseye';
import { Spinner } from '@patternfly/react-core/dist/dynamic/components/Spinner';
import InventoryLoadError from './InventoryLoadError';
import classNames from 'classnames';
import WithHistory from './WithHistory';
import { History } from 'history';

interface BaseInventoryDetailHeadProps {
  fallback?: React.ReactNode;
  innerRef?: React.Ref<unknown>;
  component?: keyof JSX.IntrinsicElements;
  className?: string;
  history?: History;
}

const BaseInventoryDetailHead: React.FC<BaseInventoryDetailHeadProps> = ({
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
  const Component = component;
  return (
    <Component className={classNames(className, 'inventory')}>
      <Suspense fallback={fallback}>
        <ScalprumComponent
          history={history}
          store={store}
          appName="inventory"
          module="./InventoryDetailHead"
          scope="inventory"
          ErrorComponent={<InventoryLoadError component="InventoryDetailHead" {...props} />}
          ref={innerRef}
          {...props}
        />
      </Suspense>
    </Component>
  );
};

export interface InventoryDetailHeadProps {
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
 * This component shows system information (tags, facts and basic operations).
 */
const InventoryDetailHead = React.forwardRef<unknown, InventoryDetailHeadProps>((props, ref) => (
  <BaseInventoryDetailHead innerRef={ref} {...props} />
));

InventoryDetailHead.displayName = 'InventoryDetailHead';

const CompatibilityWrapper = React.forwardRef<unknown, InventoryDetailHeadProps>((props, ref) => (
  <WithHistory innerRef={ref} Component={InventoryDetailHead} {...props} />
));

CompatibilityWrapper.displayName = 'InventoryDetailHeadCompatibilityWrapper';

export default CompatibilityWrapper;
