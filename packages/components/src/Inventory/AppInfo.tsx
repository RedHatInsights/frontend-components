import { FormattedMessage } from '@redhat-cloud-services/frontend-components-translations/localization';
import React, { type JSX, Suspense } from 'react';
import { ScalprumComponent, ScalprumComponentProps } from '@scalprum/react-core';
import { useStore } from 'react-redux';
import { Bullseye } from '@patternfly/react-core/dist/dynamic/layouts/Bullseye';
import { Spinner } from '@patternfly/react-core/dist/dynamic/components/Spinner';
import InventoryLoadError from './InventoryLoadError';
import classNames from 'classnames';
import WithHistory from './WithHistory';
import { History } from 'history';
import messages from '../messages';

interface BaseAppInfoProps extends Record<string, unknown> {
  fallback?: React.ReactNode;
  innerRef?: React.Ref<unknown>;
  component?: keyof JSX.IntrinsicElements;
  className?: string;
  history?: History;
}

const BaseAppInfo = ({
  fallback = (
    <Bullseye className="pf-v6-u-p-lg">
      <FormattedMessage {...messages.appInfoLoading}>{(chunks) => <Spinner size="xl" aria-label={chunks.join('')} />}</FormattedMessage>
    </Bullseye>
  ),
  component = 'section',
  className,
  history,
  innerRef,
  ...props
}: BaseAppInfoProps) => {
  const store = useStore();
  const Component = component;
  const SCProps: ScalprumComponentProps<{}, Record<string, unknown>> = {
    history,
    store,
    appName: 'inventory',
    module: './AppInfo',
    scope: 'inventory',
    ErrorComponent: <InventoryLoadError component="AppInfo" {...props} />,
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
const AppInfo = React.forwardRef<unknown, AppInfoProps>((props, ref) => <BaseAppInfo innerRef={ref} {...props} />);

AppInfo.displayName = 'AppInfo';

const CompatibilityWrapper = React.forwardRef<unknown, AppInfoProps>((props, ref) => <WithHistory innerRef={ref} Component={AppInfo} {...props} />);

CompatibilityWrapper.displayName = 'AppInfoCompatibilityWrapper';

export default CompatibilityWrapper;
