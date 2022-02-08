import React from 'react';
import { Badge, Chip, ChipGroup, Button } from '@patternfly/react-core';
import classNames from 'classnames';
import './filter-chips.scss';

export type FilterChip = {
  id?: string;
  name: string;
  isRead?: boolean;
  count?: number;
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
    <ChipGroup
      key={`group_${group.category}`}
      categoryName={String(group.category) || ' '}
      {...(onDeleteGroup && {
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
        <Chip
          key={chip.name}
          onClick={(event) => {
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
        </Chip>
      ))}
    </ChipGroup>
  ));

  const plainFilters = filters.filter(isPlainFilterChip);

  return (
    <span className={classNames(className, 'ins-c-chip-filters')}>
      {groupedFilters}
      {plainFilters &&
        plainFilters.map((chip) => (
          <ChipGroup key={`group_plain_chip_${chip.name}`}>
            <Chip
              onClick={(event) => {
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
            </Chip>
          </ChipGroup>
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
