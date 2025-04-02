import React, { FormEvent, Fragment, ReactNode, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import t_global_breakpoint_md from '@patternfly/react-tokens/dist/js/t_global_breakpoint_md';
import { Dropdown } from '@patternfly/react-core/dist/dynamic/components/Dropdown';
import { DropdownItem } from '@patternfly/react-core/dist/dynamic/components/Dropdown';
import { DropdownList } from '@patternfly/react-core/dist/dynamic/components/Dropdown';
import { Icon } from '@patternfly/react-core/dist/dynamic/components/Icon';
import { MenuToggle } from '@patternfly/react-core/dist/dynamic/components/MenuToggle';
import { Split } from '@patternfly/react-core/dist/dynamic/layouts/Split';
import { SplitItem } from '@patternfly/react-core/dist/dynamic/layouts/Split';
import { ToolbarGroup } from '@patternfly/react-core/dist/dynamic/components/Toolbar';
import { ToolbarItem } from '@patternfly/react-core/dist/dynamic/components/Toolbar';
import { ToolbarToggleGroup } from '@patternfly/react-core/dist/dynamic/components/Toolbar';

import FilterIcon from '@patternfly/react-icons/dist/dynamic/icons/filter-icon';
import TextFilter, { FilterValue, TextFilterProps } from './TextFilter';
import { conditionalFilterType, identifyComponent, typeMapper } from './conditionalFilterConstants';
import RadioFilter, { RadioFilterProps } from './RadioFilter';
import CheckboxFilter, { CheckboxFilterProps } from './CheckboxFilter';
import GroupFilter, { GroupFilterProps } from './GroupFilter';
import './conditional-filter.scss';
import SingleSelectFilter, { SingleSelectFilterProps } from './SingleSelectFilter';

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
      type: 'singleSelect';
      filterValues: RadioFilterProps;
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
  const breakpointConstant = parseInt(t_global_breakpoint_md.value.replace('px', ''));
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
    ? (props: Record<string, unknown>) => (
        <ToolbarToggleGroup
          {...props}
          breakpoint="md"
          toggleIcon={
            <Icon size="md">
              <FilterIcon />
            </Icon>
          }
        />
      )
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
    } else if (activeItem.type === 'singleSelect' && identifyComponent<SingleSelectFilterProps>(activeItem.type, activeItem.filterValues)) {
      return (
        <SingleSelectFilter placeholder={placeholder || activeItem.placeholder || `Filter by ${activeItem.label}`} {...activeItem.filterValues} />
      );
    } else if (activeItem.type === 'custom' && identifyComponent<Record<string, any>>(activeItem.type, activeItem.filterValues)) {
      const C = typeMapper.custom;
      // make sure no invalid props are passed to the Fragment element which is mapped to the custom component
      const { key, children } = activeItem.filterValues;
      return <C key={key}>{children}</C>;
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
                    onSelect={() => setIsOpen(false)}
                    isOpen={isOpen}
                    ouiaId="ConditionalFilterList"
                    onOpenChange={(isOpen: boolean) => setIsOpen(isOpen)}
                    toggle={(toggleRef) => (
                      <MenuToggle
                        isDisabled={isDisabled}
                        className={
                          hideLabel ? 'ins-c-conditional-filter__group ins-c-conditional-filter__no-label' : 'ins-c-conditional-filter__group'
                        }
                        aria-label="Conditional filter toggle"
                        ref={toggleRef}
                        onClick={() => setIsOpen((prev) => !prev)}
                        isExpanded={isOpen}
                        ouiaId="ConditionalFilterToggle"
                      >
                        <Icon size="md">
                          <FilterIcon />
                        </Icon>
                        {!hideLabel && (
                          <span className="ins-c-conditional-filter__value-selector">{activeItem && capitalize(String(activeItem.label))}</span>
                        )}
                      </MenuToggle>
                    )}
                  >
                    <DropdownList aria-label="Conditional filters list">
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
              {ActiveComponent && (
                <SplitItem isFilled data-ouia-component-id="ConditionalFilter">
                  {getActiveComponent(activeItem)}
                </SplitItem>
              )}
            </Split>
          )}
        </Fragment>
      )}
    </Wrapper>
  );
};

export default ConditionalFilter;
