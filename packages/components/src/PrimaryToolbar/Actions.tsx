import React, { Fragment, useState } from 'react';
import { Dropdown, DropdownProps, DropdownItem, KebabToggle, KebabToggleProps, Button, DropdownSeparator, ToolbarItem } from '@patternfly/react-core';
import { DownloadButton, DownloadButtonProps } from '../DownloadButton';
import classNames from 'classnames';

type ActionObject = {
  key?: string;
  label: React.ReactNode;
  value?: number | string;
  onClick?: (
    event: MouseEvent | React.MouseEvent<any, MouseEvent> | React.KeyboardEvent<Element>,
    action: ActionObject,
    key: string | number
  ) => void;
  props?: { [key: string]: any; className?: string };
};

export type ActionsType = React.ReactNode | ActionObject;

export interface ActionsProps {
  actions?: ActionsType[];
  onSelect?: DropdownProps['onSelect'];
  overflowActions?: ActionsType[];
  dropdownProps?: DropdownProps;
  kebabToggleProps?: KebabToggleProps;
  exportConfig?: DownloadButtonProps;
}

function isActionObject(node: React.ReactNode | ActionObject): node is ActionObject {
  return (node as ActionObject).label !== undefined;
}

export const overflowActionsMapper = (action: ActionsType, key: string | number) => {
  const internalAction = action as ActionObject;
  return (
    <DropdownItem
      {...internalAction.props}
      className="ins-c-primary-toolbar__overflow-actions"
      key={internalAction.value || internalAction.key || `${key}-overflow`}
      component={(internalAction.props && internalAction.props.component) || React.isValidElement(internalAction.label || action) ? 'div' : 'button'}
      onClick={(e) => internalAction.onClick && internalAction.onClick(e, internalAction, key)}
    >
      {internalAction.label || action}
    </DropdownItem>
  );
};

export const actionPropsGenerator = (action: ActionsType, key: string | number) => {
  const onClick =
    typeof action === 'object' && typeof action !== null && typeof (action as { onClick?: any })?.onClick === 'function'
      ? (e: MouseEvent | React.MouseEvent<any, MouseEvent> | React.KeyboardEvent<Element>) => (action as { onClick?: any })?.onClick(e, action, key)
      : undefined;

  return {
    ...(action as ActionObject)?.props,
    onClick,
    component: (action as ActionObject)?.props?.component || (React.isValidElement((action as ActionObject).label || action) ? 'div' : 'button'),
    children: typeof action === 'object' && typeof action !== null ? (action as { label?: React.ReactNode })?.label : action,
  };
};

const Actions: React.FunctionComponent<ActionsProps> = ({
  actions = [],
  overflowActions = [],
  onSelect = () => undefined,
  dropdownProps = {},
  kebabToggleProps,
  exportConfig,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = (isOpen: boolean) => setIsOpen(isOpen);

  const [firstAction, ...restActions] = actions;

  const dropdownItems = [
    ...(firstAction
      ? [
          <DropdownItem
            key="first-action"
            {...actionPropsGenerator(firstAction, 'first-action')}
            className={classNames('ins-c-primary-toolbar__first-action', isActionObject(firstAction) ? firstAction?.props?.className : undefined)}
          />,
        ]
      : []),
    ...restActions.map((action, key) => (
      <DropdownItem key={(action as ActionObject)?.key || (action as ActionObject)?.props?.key || key} {...actionPropsGenerator(action, key)} />
    )),
    ...(actions.length > 0 && overflowActions.length > 0
      ? [<DropdownSeparator key="separator" className="ins-c-primary-toolbar__overflow-actions-separator" />]
      : []),
    ...overflowActions.map((action, key) => overflowActionsMapper(action as ActionObject, key)),
  ];

  return (
    <Fragment>
      {firstAction && (
        <ToolbarItem className="ins-c-primary-toolbar__first-action pf-m-spacer-sm">
          {isActionObject(firstAction) ? (
            <Button
              ouiaId={`${firstAction.label}`}
              {...firstAction.props}
              onClick={firstAction.onClick || (firstAction.props && firstAction.props.onClick) || undefined}
            >
              {firstAction.label}
            </Button>
          ) : (
            firstAction
          )}
        </ToolbarItem>
      )}
      {exportConfig && (exportConfig.extraItems || exportConfig.onSelect) && (
        <ToolbarItem className="pf-m-spacer-sm">
          <DownloadButton {...exportConfig} />
        </ToolbarItem>
      )}
      {((actions && actions?.length > 0) || overflowActions.length > 0) && (
        <ToolbarItem className={`${actions.length <= 1 ? 'ins-m-actions--empty' : ''} ins-c-primary-toolbar__actions pf-m-spacer-sm`}>
          <Dropdown
            {...dropdownProps}
            isOpen={isOpen}
            isPlain
            onSelect={(...props) => {
              onSelect && onSelect(...props);
              toggleOpen(false);
            }}
            ouiaId="Actions"
            toggle={
              <KebabToggle
                {...kebabToggleProps}
                onToggle={(isOpen) => {
                  toggleOpen(isOpen);
                }}
              />
            }
            dropdownItems={dropdownItems}
          />
        </ToolbarItem>
      )}
    </Fragment>
  );
};

export default Actions;
