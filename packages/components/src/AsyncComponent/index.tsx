import React from 'react';
import { ScalprumComponent, ScalprumComponentProps } from '@scalprum/react-core';
import { Bullseye } from '@patternfly/react-core/dist/dynamic/layouts/Bullseye';
import { Spinner } from '@patternfly/react-core/dist/dynamic/components/Spinner';
import classNames from 'classnames';
import { ChromeAPI } from '@redhat-cloud-services/types';

export type ExcludeModulesKeys = 'module' | 'scope';

export type AsyncComponentProps = {
  /** Loaded module, it has to start with `./`. */
  module: string;
  /** Optional scope, if not passed appName is used. */
  scope: string;
  /** React Suspense fallback component. <a href="https://reactjs.org/docs/code-splitting.html#reactlazy" target="_blank">Learn more</a>. */
  fallback: React.ReactElement;
  /** Optional wrapper component */
  component: keyof JSX.IntrinsicElements;
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;

type BaseAsyncComponentProps = AsyncComponentProps & {
  innerRef: React.MutableRefObject<HTMLElement | null> | ((instance: HTMLElement | null) => void) | null;
};

const BaseAsyncComponent: React.FunctionComponent<BaseAsyncComponentProps> = ({
  scope,
  module,
  fallback = (
    <Bullseye>
      <Spinner size="xl" />
    </Bullseye>
  ),
  innerRef,
  className,
  component: Cmp = 'section',
  ...props
}) => {
  const SCProps: ScalprumComponentProps<ChromeAPI, Omit<AsyncComponentProps, 'component'>> = {
    className,
    module,
    scope,
    ref: innerRef,
    fallback,
    ...props,
  };
  return (
    <Cmp className={classNames(className, scope)}>
      <ScalprumComponent {...SCProps} />
    </Cmp>
  );
};

/**
 * Async component that wraps ScalprumComponent for easier manipulation.
 *
 * This component uses fallback as ErrorComponent, if you want to show different
 * component for error pass it as ErrorComponent prop.
 */
export const AsyncComponent = React.forwardRef<HTMLElement, AsyncComponentProps>((props, ref) => <BaseAsyncComponent innerRef={ref} {...props} />);

export default AsyncComponent;
