import React, { useState, useEffect } from 'react';
import { constructGroups, mapGroups } from './constants';
import { Spinner } from '@patternfly/react-core';

export const tagsFilterState = { tagsFilter: {} };
export const TAGS_FILTER = 'TAGS_FILTER';
export const tagsFilterReducer = (_state, { type, payload }) => ({
    ...type === TAGS_FILTER && {
        tagsFilter: payload
    }
});

export const useTagsFilter = (
    allTags = [],
    loaded = false,
    additionalTagsCount = 0,
    onShowMoreClick,
    [ globalState, dispatch ] = [ tagsFilterState ],
    itemText = 'item',
    showMoreTitle
) => {
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
    const [ selectedStateTags, setStateValue ] = useState({});
    const selectedTags = dispatch ? globalState.tagsFilter : selectedStateTags;
    const setValue = dispatch ? (newValue) => dispatch({ type: TAGS_FILTER, payload: newValue }) : setStateValue;

    const [ filterTagsBy, seFilterTagsBy ] = useState('');
    const filter = {
        className: 'ins-c-tagfilter',
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
        ...additionalTagsCount && {
            onShowMore: (...props) => onShowMoreClick && onShowMoreClick(...props),
            showMoreTitle: showMoreTitle || `${state.additionalTagsCount} more tags available`
        },
        ...loaded && allTags.length > 0 ? {
            groups: [
                ...constructGroups(allTags, itemText)
            ]
        } : {
            value: '',
            items: [
                {
                    value: '',
                    label: !state.loaded ?
                        <span> <Spinner size="md" /> </span> :
                        <div className="ins-c-tagfilter__no-tags"> No tags available </div>,
                    isDisabled: true,
                    className: 'ins-c-tagfilter__tail'
                }
            ]
        }
    };
    return {
        filter,
        chips: mapGroups(selectedTags, 'chips'),
        selectedTags,
        setValue,
        filterTagsBy,
        seFilterTagsBy
    };
};
