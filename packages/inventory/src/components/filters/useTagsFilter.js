import { useTagsFilter as tagsFilter } from '@redhat-cloud-services/frontend-components/FilterHooks';

export const useTagsFilter = (
    allTags = [],
    loaded = false,
    additionalTagsCount = 0,
    onShowMoreClick,
    stateMapper
) => {
    const {
        filter,
        chips,
        selectedTags,
        setValue,
        filterTagsBy,
        seFilterTagsBy
    } = tagsFilter(
        allTags,
        loaded,
        additionalTagsCount,
        onShowMoreClick,
        stateMapper,
        'system'
    );

    return {
        tagsFilter: {
            label: 'Tags',
            value: 'tags',
            type: 'group',
            placeholder: 'Filter system by tag',
            filterValues: {
                ...filter
            }
        },
        tagsChip: chips,
        selectedTags,
        setSelectedTags: setValue,
        filterTagsBy,
        seFilterTagsBy
    };
};
