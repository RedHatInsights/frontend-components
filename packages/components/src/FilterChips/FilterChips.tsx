import React from 'react';
import { Badge, Button, Label, LabelGroup } from '@patternfly/react-core';
import classNames from 'classnames';
import './filter-chips.scss';

export type FilterChip = {
  id?: string;
  name: string;
  isRead?: boolean;
  count?: number;
  icon?: React.ReactNode;
};

export type FilterChipGroup = {
  category: string;
  chips: FilterChip[];
};

export type FilterChipsFilter = FilterChip | FilterChipGroup;

export interface FilterChipsProps {
  className?: string;
  filters?: FilterChipsFilter[];
  onDelete?: (event: React.MouseEvent<Element, MouseEvent>, group: FilterChipsFilter[], deleteAll?: boolean) => void;
  onDeleteGroup?: (event: React.MouseEvent<Element, MouseEvent>, group: FilterChipsFilter[], groups: FilterChipGroup[]) => void;
  deleteTitle?: React.ReactNode;
  showDeleteButton?: boolean;
}

function isFilterChipGroup(group: FilterChipsFilter): group is FilterChipGroup {
  return Object.prototype.hasOwnProperty.call(group, 'category');
}

function isPlainFilterChip(group: FilterChipsFilter): group is FilterChip {
  return !isFilterChipGroup(group);
}

const FilterChips: React.FunctionComponent<FilterChipsProps> = ({
  className,
  filters = [],
  onDelete = () => undefined,
  deleteTitle = 'Clear filters',
  showDeleteButton,
  onDeleteGroup,
}) => {
  const groups: FilterChipGroup[] = filters.filter(isFilterChipGroup);
  const groupedFilters = groups.map((group, groupKey) => (
    <LabelGroup
      key={`group_${group.category}`}
      categoryName={String(group.category) || ' '}
      {...(group.chips.length > 1 && onDeleteGroup && {
        isClosable: true,
        onClick: (event) => {
          event.stopPropagation();
          onDeleteGroup(
            event,
            [group],
            groups.filter((_item, key) => key !== groupKey)
          );
        },
      })}
    >
      {group.chips.map((chip) => (
        <Label
          key={chip.name}
          icon={chip.icon}
          variant="outline"
          onClose={(event) => {
            event.stopPropagation();
            onDelete(event, [{ ...group, chips: [chip] }]);
          }}
        >
          {chip.name}
          {chip.count && (
            <Badge key={`chip_badge_${chip.id}`} isRead={chip.isRead}>
              {chip.count}
            </Badge>
          )}
        </Label>
      ))}
    </LabelGroup>
  ));

  const plainFilters = filters.filter(isPlainFilterChip);

  return (
    <span className={classNames(className, 'ins-c-chip-filters')}>
      {groupedFilters}
      {plainFilters &&
        plainFilters.map((chip) => (
          <LabelGroup 
            key={`group_plain_chip_${chip.name}`}
          >
            <Label
              variant="outline"
              icon={chip.icon}
              onClose={(event) => {
                event.stopPropagation();
                onDelete(event, [chip]);
              }}
            >
              {chip.name}
              {chip.count && (
                <Badge key={`chip_badge_${chip.id}`} isRead={chip.isRead}>
                  {chip.count}
                </Badge>
              )}
            </Label>
          </LabelGroup>
        ))}
      {(showDeleteButton === true || (showDeleteButton === undefined && filters.length > 0)) && (
        <Button variant="link" ouiaId="ClearFilters" onClick={(event) => onDelete(event, filters, true)}>
          {deleteTitle}
        </Button>
      )}
    </span>
  );
};

export default FilterChips;
