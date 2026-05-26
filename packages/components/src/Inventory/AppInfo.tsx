import React, { Suspense } from 'react';
import { ScalprumComponent } from '@scalprum/react-core';
import { useStore } from 'react-redux';
import { Bullseye } from '@patternfly/react-core/dist/dynamic/layouts/Bullseye';
import { Spinner } from '@patternfly/react-core/dist/dynamic/components/Spinner';
import InventoryLoadError from './InventoryLoadError';
import classNames from 'classnames';
import WithHistory from './WithHistory';
import { History } from 'history';

interface BaseAppInfoProps extends Record<string, unknown> {
  fallback?: React.ReactNode;
  innerRef?: React.Ref<unknown>;
  component?: keyof JSX.IntrinsicElements;
  className?: string;
  history?: History;
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
  const Component = component;
  return (
    <Component className={classNames(className, 'inventory')}>
      <Suspense fallback={fallback}>
        <ScalprumComponent
          history={history}
          store={store}
          appName="inventory"
          module="./AppInfo"
          scope="inventory"
          ErrorComponent={<InventoryLoadError component="AppInfo" {...props} />}
          ref={innerRef}
          {...props}
        />
      </Suspense>
    </Component>
  );
};

export interface AppInfoProps extends Record<string, unknown> {
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
 * This component shows tab(s) with detail information about selected system.
 */
const AppInfo = React.forwardRef<unknown, AppInfoProps>((props, ref) => (
  <BaseAppInfo innerRef={ref} {...props} />
));

AppInfo.displayName = 'AppInfo';

const CompatibilityWrapper = React.forwardRef<unknown, AppInfoProps>((props, ref) => (
  <WithHistory innerRef={ref} Component={AppInfo} {...props} />
));

CompatibilityWrapper.displayName = 'AppInfoCompatibilityWrapper';

export default CompatibilityWrapper;
