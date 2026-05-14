import React, { Suspense } from 'react';
import { ScalprumComponent } from '@scalprum/react-core';
import { useStore } from 'react-redux';
import { Bullseye } from '@patternfly/react-core/dist/dynamic/layouts/Bullseye';
import { Spinner } from '@patternfly/react-core/dist/dynamic/components/Spinner';
import InventoryLoadError from './InventoryLoadError';
import classNames from 'classnames';
import WithHistory from './WithHistory';
import { History } from 'history';

interface BaseDetailWrapperProps {
  fallback?: React.ReactNode;
  innerRef?: React.Ref<unknown>;
  component?: keyof JSX.IntrinsicElements;
  className?: string;
  history?: History;
}

const BaseDetailWrapper: React.FC<BaseDetailWrapperProps> = ({
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
  const Component = component;
  return (
    <Component className={classNames(className, 'inventory')}>
      <Suspense fallback={fallback}>
        <ScalprumComponent
          history={history}
          store={store}
          appName="inventory"
          module="./DetailWrapper"
          scope="inventory"
          ErrorComponent={<InventoryLoadError component="DetailWrapper" {...props} />}
          ref={innerRef}
          {...props}
        />
      </Suspense>
    </Component>
  );
};

export interface DetailWrapperProps {
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
 * This component wraps entire system detail in order to show loading state and drawer (if enabled).
 */
const DetailWrapper = React.forwardRef<unknown, DetailWrapperProps>((props, ref) => (
  <BaseDetailWrapper innerRef={ref} {...props} />
));

DetailWrapper.displayName = 'DetailWrapper';

const CompatibilityWrapper = React.forwardRef<unknown, DetailWrapperProps>((props, ref) => (
  <WithHistory innerRef={ref} Component={DetailWrapper} {...props} />
));

CompatibilityWrapper.displayName = 'DetailWrapperCompatibilityWrapper';

export default CompatibilityWrapper;
