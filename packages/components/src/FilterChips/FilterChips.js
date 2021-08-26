import React from 'react';
import PropTypes from 'prop-types';
import { Badge, Chip, ChipGroup, Button } from '@patternfly/react-core';
import classNames from 'classnames';
import './filter-chips.scss';

const FilterChips = ({ className, filters, onDelete, deleteTitle, showDeleteButton, onDeleteGroup }) => {
    const groups = filters.filter(group => Object.prototype.hasOwnProperty.call(group, 'category'));
    const groupedFilters = groups.map((group, groupKey) =>  (
        <ChipGroup
            key={ `group_${group.category}` }
            categoryName={String(group.category) || ' '}
            {...onDeleteGroup && {
                isClosable: true,
                onClick: (event) => {
                    event.stopPropagation();
                    onDeleteGroup(event, [ group ], groups.filter((_item, key) => key !== groupKey));
                } }}
        >
            {group.chips.map(chip => (
                <Chip
                    key={chip.name}
                    onClick={ (event) => {
                        event.stopPropagation();
                        onDelete(event, [{ ...group, chips: [ chip ] }]);
                    }}
                >
                    { chip.name }
                    { chip.count && <Badge key={ `chip_badge_${chip.id}` } isRead={ chip.isRead }>{ chip.count }</Badge> }
                </Chip>
            ))}
        </ChipGroup>
    ));

    const plainFilters = filters.filter(group => !(Object.prototype.hasOwnProperty.call(group, 'category')));

    return (
        <span className={classNames(className, 'ins-c-chip-filters')}>
            { groupedFilters }
            { plainFilters && plainFilters.map(chip => (
                <ChipGroup key={ `group_plain_chip_${chip.name}` }>
                    <Chip
                        onClick={ (event) => {
                            event.stopPropagation();
                            onDelete(event, [ chip ]);
                        }}
                    >
                        { chip.name }
                        { chip.count && <Badge key={ `chip_badge_${chip.id}` } isRead={ chip.isRead }>{ chip.count }</Badge> }
                    </Chip>
                </ChipGroup>
            )) }
            { (showDeleteButton === true || (showDeleteButton === undefined && filters.length > 0)) &&
                <Button variant="link" onClick={ (event) => onDelete(event, filters, true) }>{deleteTitle}</Button> }
        </span>
    );
};

FilterChips.propTypes = {
    className: PropTypes.string,
    filters: PropTypes.arrayOf(
        PropTypes.oneOfType([
            PropTypes.shape({
                category: PropTypes.string.isRequired,
                chips: PropTypes.arrayOf(
                    PropTypes.shape({
                        name: PropTypes.string.isRequired,
                        isRead: PropTypes.bool,
                        count: PropTypes.number
                    })
                ).isRequired
            }),
            PropTypes.shape({
                name: PropTypes.string.isRequired,
                isRead: PropTypes.bool,
                count: PropTypes.number
            })
        ])
    ),
    onDelete: PropTypes.func,
    onDeleteGroup: PropTypes.func,
    deleteTitle: PropTypes.node,
    showDeleteButton: PropTypes.bool
};

FilterChips.defaultProps = {
    filters: [],
    onDelete: () => undefined,
    deleteTitle: 'Clear filters'
};

export default FilterChips;
