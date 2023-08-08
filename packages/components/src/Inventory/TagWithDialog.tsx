import React, { Suspense } from 'react';
import { ScalprumComponent, ScalprumComponentProps } from '@scalprum/react-core';
import { useStore } from 'react-redux';
import { Bullseye, Spinner } from '@patternfly/react-core';
import InventoryLoadError from './InventoryLoadError';
import classNames from 'classnames';
import { AsyncComponentProps, ExcludeModulesKeys } from '../AsyncComponent';
import { ChromeAPI } from '@redhat-cloud-services/types';
import WithHistory from './WithHistory';

export type TagWithDialogProps = Omit<AsyncComponentProps, ExcludeModulesKeys>;

/**
 * Inventory sub component.
 *
 * This component is used to manipulate with inventory tags.
 */
const BaseTagWithDialog: React.FC<TagWithDialogProps> = (props) => {
  const store = useStore();
  const Cmp = props.component;
  const SCProps: ScalprumComponentProps<ChromeAPI, TagWithDialogProps> = {
    history: props.history,
    store,
    appName: 'inventory',
    module: './TagWithDialog',
    scope: 'inventory',
    ErrorComponent: <InventoryLoadError component="InventoryDetailHead" {...props} />,
    ref: props.innerRef,
    ...props,
  };
  return (
    <Cmp className={classNames(props.className, 'inventory')}>
      <Suspense fallback={props.fallback}>
        <ScalprumComponent {...SCProps} />
      </Suspense>
    </Cmp>
  );
};

/**
 * Inventory sub component.
 *
 * This component shows systems table connected to redux.
 */
const TagWithDialog: React.FC<TagWithDialogProps> = React.forwardRef(
  (
    {
      component = 'section',
      fallback = (
        <Bullseye className="pf-v5-u-p-lg">
          <Spinner size="xl" />
        </Bullseye>
      ),
      ...props
    },
    ref
  ) => <BaseTagWithDialog innerRef={ref} component={component} fallback={fallback} {...props} />
);

const CompatiblityWrapper = (props: any, ref: any) => <WithHistory innerRef={ref} Component={TagWithDialog} {...props} />;

export default React.forwardRef(CompatiblityWrapper);
