import React, { Suspense, type JSX } from 'react';
import { ScalprumComponent } from '@scalprum/react-core';
import { useStore } from 'react-redux';
import { Bullseye } from '@patternfly/react-core/dist/dynamic/layouts/Bullseye';
import { Spinner } from '@patternfly/react-core/dist/dynamic/components/Spinner';
import InventoryLoadError from './InventoryLoadError';
import classNames from 'classnames';
import WithHistory from './WithHistory';

interface BaseAppInfoProps {
  fallback?: React.ReactNode;
  innerRef?: React.Ref<unknown>;
  component?: string;
  className?: string;
  history?: any;
}

const BaseAppInfo: React.FC<BaseAppInfoProps> = ({
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
          module="./AppInfo"
          scope="inventory"
          ErrorComponent={<InventoryLoadError component="InventoryDetailHead" {...props} />}
          ref={innerRef}
          {...props}
        />
      </Suspense>
    </Component>
  );
};

export interface AppInfoProps {
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
 * This component shows tab(s) with detail information about selected system.
 */
const AppInfo = React.forwardRef<any, AppInfoProps>((props, ref) => (
  <BaseAppInfo innerRef={ref} {...props} />
));

AppInfo.displayName = 'AppInfo';

const CompatibilityWrapper = React.forwardRef<any, AppInfoProps>((props, ref) => (
  <WithHistory innerRef={ref} Component={AppInfo} {...props} />
));

CompatibilityWrapper.displayName = 'AppInfoCompatibilityWrapper';

export default CompatibilityWrapper;
