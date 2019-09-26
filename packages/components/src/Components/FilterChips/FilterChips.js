import React from 'react';
import PropTypes from 'prop-types';
import { Badge, Chip, ChipGroup, ChipGroupToolbarItem, Button } from '@patternfly/react-core';

const FilterChips = ({ filters, onDelete }) => {
    const groupedFilters = filters.filter(group => group.category).map(group => (
        <ChipGroupToolbarItem
            key={ `group_${group.category}` }
            categoryName={ group.category }
            onClick={ (event) => onDelete(event, [ group ]) }
        >
            { group.chips.map(chip => (
                <Chip
                    key={ `group_${group.category}_chip_${chip.name}` }
                    onClick={ (event) => onDelete(event, [{ category: group.category, chips: [ chip ]}]) }
                >
                    { chip.name }
                    { chip.count && <Badge key={ `chip_badge_${chip.id}` } isRead={ chip.isRead }>{ chip.count }</Badge> }
                </Chip>
            )) }
        </ChipGroupToolbarItem>
    ));

    const plainFilters = filters.filter(group => !(group.category));

    return (
        <React.Fragment>
            <ChipGroup withToolbar>
                { groupedFilters }
                { plainFilters &&
                    <ChipGroupToolbarItem
                        key={ `group_plain` }
                        onClick={ (event) => onDelete(event, plainFilters) }
                        className='ins-c-chip-group__plain'
                    >
                        { plainFilters.map(chip => (
                            <Chip
                                key={ `group_plain_chip_${chip.name}` }
                                onClick={ (event) => onDelete(event, [{ category: group.category, chips: [ chip ]}]) }
                            >
                                { chip.name }
                                { chip.count && <Badge key={ `chip_badge_${chip.id}` } isRead={ chip.isRead }>{ chip.count }</Badge> }
                            </Chip>
                        )) }
                    </ChipGroupToolbarItem>
                }
            </ChipGroup>
            <Button variant="link" onClick={ (event) => onDelete(event, filters, true) }>Clear filters</Button>
        </React.Fragment>
    );
};

FilterChips.propTypes = {
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
    onDelete: PropTypes.func
};

export default FilterChips;
