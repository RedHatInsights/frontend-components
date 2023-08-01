import React, { Fragment, useRef, useState } from 'react';
import classnames from 'classnames';
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
  getDefaultOUIAId,
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
  ouiaId?: string;
  ouiaSafe?: boolean;
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
  ouiaId,
  ouiaSafe = true,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { current: hasError } = useRef(false);
  const { current: ouiaStateId } = useRef(getDefaultOUIAId('RHI/BulkSelect'));

  const onToggle = (isOpen: boolean) => setIsOpen(isOpen);

  const ouiaFinalId = ouiaId !== undefined ? ouiaId : ouiaStateId;

  return (
    <Fragment>
      {items && items.length > 0 ? (
        <Dropdown
          onSelect={() => onToggle(false)}
          {...props}
          className={classnames(className, 'ins-c-bulk-select')}
          ouiaId={ouiaFinalId}
          ouiaSafe={ouiaSafe}
          toggle={(toggleRef) => (
            <MenuToggle {...toggleProps} isDisabled={isDisabled} isExpanded={isOpen} ref={toggleRef} onClick={() => setIsOpen((prev) => !prev)}>
              <Fragment key="split-checkbox">
                {hasError ? (
                  <MenuToggleCheckbox
                    id={id ? `${id}-toggle-checkbox` : 'toggle-checkbox'}
                    aria-label="Select all"
                    onChange={onSelect}
                    isChecked={checked}
                    ouiaId={ouiaFinalId}
                  />
                ) : (
                  <MenuToggleCheckbox
                    id={id ? `${id}-toggle-checkbox` : 'toggle-checkbox'}
                    aria-label="Select all"
                    onChange={onSelect}
                    isChecked={checked}
                    ouiaId={ouiaFinalId}
                  >
                    {count ? `${count} selected` : ''}
                  </MenuToggleCheckbox>
                )}
              </Fragment>
            </MenuToggle>
          )}
          isOpen={isOpen}
        >
          <DropdownList>
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
                ouiaId={`${ouiaFinalId}-${oneItem.key || key}`}
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
        />
      )}
    </Fragment>
  );
};

export default BulkSelect;
