import React, { useState, useEffect } from 'react';
import { constructGroups, mapGroups } from '../../shared';
import { Spinner } from '@patternfly/react-core/dist/esm/components/Spinner';

export const useTagsFilter = (allTags = [], loaded = false, additionalTagsCount = 0, onShowMoreClick) => {
    const [ state, setState ] = useState({
        allTags: [],
        loaded: false,
        additionalTagsCount: 0
    });
    useEffect(() => {
        setState(() => ({
            allTags,
            loaded,
            additionalTagsCount
        }));
    }, [ loaded ]);
    const [ selectedTags, setValue ] = useState({});
    const [ filterTagsBy, seFilterTagsBy ] = useState('');
    const filter = {
        label: 'Tags',
        value: 'tags',
        type: 'group',
        placeholder: 'Filter system by tag',
        filterValues: {
            className: 'ins-c-inventory__tags-filter',
            onFilter: (value) => seFilterTagsBy(value),
            filterBy: filterTagsBy,
            onChange: (_e, newSelection, group, item, groupKey, itemKey) => {
                if (item.meta) {
                    const isSelected = newSelection[groupKey][itemKey];
                    newSelection[groupKey][itemKey] = {
                        isSelected,
                        group,
                        item
                    };
                    setValue(newSelection);
                }
            },
            selected: selectedTags,
            ...loaded && allTags.length > 0 ? {
                groups: [
                    ...constructGroups(state.allTags),
                    ...additionalTagsCount > 0 ? [{
                        items: [{
                            label: `${state.additionalTagsCount} more tags available`,
                            onClick: (...props) => onShowMoreClick && onShowMoreClick(...props),
                            className: 'ins-c-inventory__tags-more-items'
                        }]
                    }] : []
                ]
            } : {
                items: [
                    {
                        label: !state.loaded ?
                            <span> <Spinner size="md" /> </span> :
                            <div className="ins-c-inventory__tags-no-tags"> No tags available </div>,
                        isDisabled: true,
                        className: 'ins-c-inventory__tags-tail'
                    }
                ]
            }
        }
    };
    return [ filter, mapGroups(selectedTags, 'chips'), selectedTags, setValue, filterTagsBy, seFilterTagsBy ];
};
