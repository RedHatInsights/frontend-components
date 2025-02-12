import React, { Fragment, useRef, useState } from 'react';
import classnames from 'classnames';
// eslint-disable-next-line rulesdir/forbid-pf-relative-imports
import {
  Checkbox,
  Dropdown,
  DropdownItem,
  DropdownItemProps,
  DropdownList,
  MenuToggle,
  MenuToggleCheckbox,
  MenuToggleCheckboxProps,
  MenuToggleProps,
} from '@patternfly/react-core';

import './bulk-select.scss';

export type BulkSelectItem = {
  key?: string | number;
  title?: string;
  props?: DropdownItemProps;
  onClick?: (
    event: MouseEvent | React.MouseEvent<any, MouseEvent> | React.KeyboardEvent<Element>,
    oneItem: BulkSelectItem,
    key: string | number
  ) => void;
};

export interface BulkSelectProps {
  count?: number;
  className?: string;
  items?: BulkSelectItem[];
  checked?: boolean | null;
  id?: string;
  onSelect?: MenuToggleCheckboxProps['onChange'];
  toggleProps?: MenuToggleProps;
  isDisabled?: boolean;
  ouiaSafe?: boolean;
  dropdownOuiaId?: string;
  checkboxOuiaId?: string;
  listOuiaId?: string;
}

const BulkSelect: React.FunctionComponent<BulkSelectProps> = ({
  id,
  isDisabled = false,
  items = [],
  onSelect,
  checked = false,
  toggleProps,
  count,
  className,
  ouiaSafe = true,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { current: hasError } = useRef(false);

  const onToggle = (isOpen: boolean) => setIsOpen(isOpen);

  const { dropdownOuiaId, checkboxOuiaId, listOuiaId } = props;

  return (
    <Fragment>
      {items && items.length > 0 ? (
        <Dropdown
          onSelect={() => onToggle(false)}
          onOpenChange={(isOpen: boolean) => setIsOpen(isOpen)}
          ouiaId={dropdownOuiaId ?? 'BulkSelect'}
          {...props}
          className={classnames(className, 'ins-c-bulk-select')}
          ouiaSafe={ouiaSafe}
          toggle={(toggleRef) => (
            <MenuToggle
              {...toggleProps}
              isDisabled={isDisabled}
              isExpanded={isOpen}
              ref={toggleRef}
              onClick={() => setIsOpen((prev) => !prev)}
              ouiaId={dropdownOuiaId ?? 'BulkSelect'}
            >
              {toggleProps?.children ? (
                toggleProps?.children
              ) : (
                <Fragment key="split-checkbox">
                  <MenuToggleCheckbox
                    id={id ? `${id}-toggle-checkbox` : 'toggle-checkbox'}
                    aria-label="Select all"
                    onChange={(checked, event) => {
                      setIsOpen(false);
                      onSelect?.(checked, event);
                    }}
                    isChecked={checked}
                    ouiaId={checkboxOuiaId ?? 'BulkSelectCheckbox'}
                  >
                    {!hasError && count ? `${count} selected` : ''}
                  </MenuToggleCheckbox>
                </Fragment>
              )}
            </MenuToggle>
          )}
          isOpen={isOpen}
        >
          <DropdownList data-ouia-component-id={listOuiaId ?? 'BulkSelectList'}>
            {count !== undefined && count > 0 && (
              <DropdownItem
                key="count"
                isDisabled
                className={classnames({
                  'ins-c-bulk-select__selected': !hasError,
                })}
              >
                {count} Selected
              </DropdownItem>
            )}
            {items.map((oneItem, key) => (
              <DropdownItem
                component="button"
                key={oneItem.key || key}
                ouiaId={`${listOuiaId ?? 'BulkSelectList'}-${oneItem.key || key}`}
                onClick={(event) => oneItem.onClick && oneItem.onClick(event, oneItem, key)}
                {...oneItem?.props}
              >
                {oneItem.title}
              </DropdownItem>
            ))}
          </DropdownList>
        </Dropdown>
      ) : (
        <Checkbox
          {...props}
          aria-label="Select all"
          className={classnames(className, 'ins-c-bulk-select')}
          id={`${id}-checkbox`}
          isChecked={checked}
          onChange={(e, checked) => onSelect?.(checked, e)}
          ouiaId={dropdownOuiaId ?? 'BulkSelect'}
        />
      )}
    </Fragment>
  );
};

export default BulkSelect;
