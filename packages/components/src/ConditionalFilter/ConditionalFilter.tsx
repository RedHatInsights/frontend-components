import React, { FormEvent, Fragment, ReactNode, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import globalBreakpointMd from '@patternfly/react-tokens/dist/js/global_breakpoint_md';
import {
  Dropdown,
  DropdownItem,
  DropdownList,
  Icon,
  MenuToggle,
  Split,
  SplitItem,
  ToolbarGroup,
  ToolbarItem,
  ToolbarToggleGroup,
} from '@patternfly/react-core';

import { FilterIcon } from '@patternfly/react-icons';
import TextFilter, { FilterValue, TextFilterProps } from './TextFilter';
import { conditionalFilterType, identifyComponent, typeMapper } from './conditionalFilterConstants';
import RadioFilter, { RadioFilterProps } from './RadioFilter';
import CheckboxFilter, { CheckboxFilterProps } from './CheckboxFilter';
import GroupFilter, { GroupFilterProps } from './GroupFilter';
import './conditional-filter.scss';

export type FilterValues = TextInputProps &
  RadioFilterProps &
  CheckboxFilterProps &
  GroupFilterProps & {
    /** Optional items. */
    items?: FilterValue[];
  };
export interface TextInputProps {
  /** Optional id. */
  id?: string;
  /** Optional onChange callback. */
  onChange?: (e: React.MouseEvent | React.ChangeEvent | React.FormEvent<HTMLInputElement>, selection?: number | string) => void;
  /** Optional text input placeholder. */
  placeholder?: string;
  /** Optional value. */
  value?: string;
}

/**
 * Component that works as a conditional filter with different types of items and groups.
 *
 * It supports type text, checkbox, radio, custom, group (+ tree view).
 */
export type ConditionalFilterItem = {
  id?: string;
  label?: ReactNode;
  placeholder?: string;
  value?: string;
} & (
  | {
      type: 'checkbox';
      filterValues: CheckboxFilterProps;
    }
  | {
      type: 'text';
      filterValues: TextFilterProps;
    }
  | {
      type: 'radio';
      filterValues: RadioFilterProps;
    }
  | {
      type: 'group';
      filterValues: GroupFilterProps;
    }
  | {
      type: 'custom';
      filterValues: Record<string, any>;
    }
);

export interface ConditionalFilterProps<R extends HTMLElement = NonNullable<any>> extends TextInputProps {
  hideLabel?: boolean;
  items: ConditionalFilterItem[];
  id?: string;
  isDisabled?: boolean;
  innerRef?: React.RefObject<R>;
}

const ConditionalFilter: React.FunctionComponent<ConditionalFilterProps> = ({
  hideLabel = false,
  id = 'default-input',
  isDisabled = false,
  items = [],
  onChange,
  placeholder,
  value = '',
  innerRef,
}) => {
  const breakpointConstant = parseInt(globalBreakpointMd.value.replace('px', ''));
  const updateFilterViewport = (width: number) => width <= breakpointConstant;
  const [isOpen, setIsOpen] = useState(false);
  const [stateValue, setStateValue] = useState<number | string>();
  const [isMobile, setIsMobile] = useState(updateFilterViewport(window.innerWidth));
  const resizeListener = useRef((event: Event) => {
    setIsMobile(updateFilterViewport((event?.target as Window).innerWidth));
  });

  useEffect(() => {
    window.addEventListener('resize', resizeListener.current);

    return () => {
      resizeListener.current && window.removeEventListener('resize', resizeListener.current);
    };
  }, []);

  const currentValue = onChange ? value : stateValue;
  const activeItem = items && items.length && (items.find((item, key) => item.value === currentValue || key === Number(currentValue)) || items[0]);
  const onChangeDefault = (_e: FormEvent<HTMLInputElement>, value: number | string) => setStateValue(value);
  const onChangeCallback = onChange || onChangeDefault;

  const capitalize = (string: string) => string[0].toUpperCase() + string.substring(1);

  const Wrapper = isMobile
    ? (props: Record<string, unknown>) => <ToolbarToggleGroup {...props} breakpoint="md" toggleIcon={<FilterIcon />}></ToolbarToggleGroup>
    : Fragment;

  const getActiveComponent = (activeItem: ConditionalFilterItem) => {
    if (activeItem.type === 'checkbox' && identifyComponent<CheckboxFilterProps>(activeItem.type, activeItem.filterValues)) {
      return <CheckboxFilter placeholder={placeholder || activeItem.placeholder || `Filter by ${activeItem.label}`} {...activeItem.filterValues} />;
    } else if (activeItem.type === 'text' && identifyComponent<TextFilterProps>(activeItem.type, activeItem.filterValues)) {
      return <TextFilter placeholder={placeholder || activeItem.placeholder || `Filter by ${activeItem.label}`} {...activeItem.filterValues} />;
    } else if (activeItem.type === 'group' && identifyComponent<GroupFilterProps>(activeItem.type, activeItem.filterValues)) {
      return <GroupFilter placeholder={placeholder || activeItem.placeholder || `Filter by ${activeItem.label}`} {...activeItem.filterValues} />;
    } else if (activeItem.type === 'radio' && identifyComponent<RadioFilterProps>(activeItem.type, activeItem.filterValues)) {
      return (
        <RadioFilter
          innerRef={innerRef}
          placeholder={placeholder || activeItem.placeholder || `Filter by ${activeItem.label}`}
          {...activeItem.filterValues}
        />
      );
    } else if (activeItem.type === 'custom' && identifyComponent<Record<string, any>>(activeItem.type, activeItem.filterValues)) {
      const C = typeMapper.custom;
      return <C {...activeItem.filterValues} />;
    } else {
      throw new Error(`Invalid conditional filter component type! Expected one of ${Object.keys(conditionalFilterType)}, got ${activeItem.type}.`);
    }
  };

  const ActiveComponent = activeItem && (typeMapper[activeItem.type] || typeMapper.text);

  return (
    <Wrapper>
      {isMobile && (
        <ToolbarGroup className="ins-c-conditional-filter mobile">
          {items.map((activeItem, key) => (
            <ToolbarItem key={key}>{getActiveComponent(activeItem)}</ToolbarItem>
          ))}
        </ToolbarGroup>
      )}
      {!isMobile && (
        <Fragment>
          {!items || (items && items.length <= 0) ? (
            <div
              className={classNames('ins-c-conditional-filter', {
                desktop: isMobile,
              })}
            >
              <TextFilter
                innerRef={innerRef}
                id={id}
                isDisabled={isDisabled}
                onChange={(e) => onChangeCallback(e as FormEvent<HTMLInputElement>, (e.target as HTMLInputElement).value)}
                placeholder={placeholder}
                value={currentValue ? String(currentValue) : undefined}
                widget-type="InsightsInput"
              />
            </div>
          ) : (
            <Split
              className={classNames('ins-c-conditional-filter', {
                desktop: isMobile,
              })}
            >
              {items.length > 1 && (
                <SplitItem>
                  <Dropdown
                    ref={innerRef}
                    className="ins-c-conditional-filter__group"
                    onSelect={() => setIsOpen(false)}
                    isOpen={isOpen}
                    ouiaId="ConditionalFilter"
                    toggle={(toggleRef) => (
                      <MenuToggle
                        isDisabled={isDisabled}
                        className={hideLabel ? 'ins-c-conditional-filter__no-label' : ''}
                        aria-label="Conditional filter"
                        ref={toggleRef}
                        onClick={() => setIsOpen((prev) => !prev)}
                        isExpanded={isOpen}
                      >
                        <Icon size="sm">
                          <FilterIcon />
                        </Icon>
                        {!hideLabel && (
                          <span className="ins-c-conditional-filter__value-selector">{activeItem && capitalize(String(activeItem.label))}</span>
                        )}
                      </MenuToggle>
                    )}
                  >
                    <DropdownList>
                      {items.map((item, key) => (
                        <DropdownItem
                          key={item.id ? `${item.id}-dropdown` : key}
                          component="button"
                          ouiaId={String(item.label)}
                          onClick={(e) => onChangeCallback(e as FormEvent<HTMLInputElement>, item.value || key)}
                        >
                          {capitalize(String(item.label))}
                        </DropdownItem>
                      ))}
                    </DropdownList>
                  </Dropdown>
                </SplitItem>
              )}
              {ActiveComponent && <SplitItem isFilled>{getActiveComponent(activeItem)}</SplitItem>}
            </Split>
          )}
        </Fragment>
      )}
    </Wrapper>
  );
};

export default ConditionalFilter;
