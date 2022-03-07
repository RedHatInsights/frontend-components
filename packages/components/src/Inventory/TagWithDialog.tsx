import React, { Suspense } from 'react';
import { ScalprumComponent } from '@scalprum/react-core';
import { useHistory } from 'react-router-dom';
import { useStore } from 'react-redux';
import { Bullseye, Spinner } from '@patternfly/react-core';
import InventoryLoadError from './InventoryLoadError';
import classNames from 'classnames';
import { AsyncComponentProps, ExcludeModulesKeys } from '../AsyncComponent';

export type TagWithDialogProps = Omit<AsyncComponentProps, ExcludeModulesKeys>;

/**
 * Inventory sub component.
 *
 * This component is used to manipulate with inventory tags.
 */
const BaseTagWithDialog: React.FC<TagWithDialogProps> = (props) => {
  const history = useHistory();
  const store = useStore();
  const Cmp = props.component;
  return (
    <Cmp className={classNames(props.className, 'inventory')}>
      <Suspense fallback={props.fallback}>
        <ScalprumComponent
          history={history}
          store={store}
          appName="inventory"
          module="./TagWithDialog"
          scope="inventory"
          ErrorComponent={<InventoryLoadError component="InventoryDetailHead" {...props} />}
          ref={props.innerRef}
          {...props}
        />
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
        <Bullseye className="pf-u-p-lg">
          <Spinner size="xl" />
        </Bullseye>
      ),
      ...props
    },
    ref
  ) => <BaseTagWithDialog innerRef={ref} component={component} fallback={fallback} {...props} />
);

export default TagWithDialog;
