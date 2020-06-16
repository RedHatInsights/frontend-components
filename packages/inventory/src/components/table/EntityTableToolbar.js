/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
import React, { Fragment, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Skeleton, SkeletonSize } from '@redhat-cloud-services/frontend-components/components/esm/Skeleton';
import { PrimaryToolbar } from '@redhat-cloud-services/frontend-components/components/esm/PrimaryToolbar';
import { fetchAllTags, clearFilters, entitiesLoading, toggleTagModal } from '../../redux/actions';
import debounce from 'lodash/debounce';
import flatMap from 'lodash/flatMap';
import {
    TagsModal,
    mapGroups,
    TEXT_FILTER,
    reduceFilters,
    TEXTUAL_CHIP,
    STALE_CHIP,
    REGISTERED_CHIP,
    TAG_CHIP,
    arrayToSelection,
    loadSystems
} from '../../shared';
import { onDeleteFilter, onDeleteTag } from './helpers';
import { useStalenessFilter, useTextFilter, useRegisteredWithFilter, useTagsFilter } from '../filters';

const EntityTableToolbar = ({
    total,
    page,
    perPage,
    filterConfig,
    hasItems,
    children,
    actionsConfig,
    onRefresh,
    hasCheckbox,
    activeFiltersConfig,
    showTags,
    isLoaded,
    items,
    sortBy,
    ...props
}) => {
    const dispatch = useDispatch();
    const filters = useSelector(({ entities: { activeFilters } }) => activeFilters || []);
    const loaded = useSelector(({ entities: { loaded } }) => hasItems && isLoaded !== undefined ? (isLoaded && loaded) : loaded);
    const allTagsLoaded = useSelector(({ entities: { allTagsLoaded } }) => allTagsLoaded);
    const allTags = useSelector(({ entities: { allTags } }) => allTags);
    const additionalTagsCount = useSelector(({ entities: { additionalTagsCount } }) => additionalTagsCount);
    const [ nameFilter, nameChip, textFilter, setTextFilter ] = useTextFilter('');
    const [ stalenessFilter, stalenessChip, staleFilter, setStaleFilter ] = useStalenessFilter();
    const [ registeredFilter, registeredChip, registeredWithFilter, setRegisteredWithFilter ] = useRegisteredWithFilter();
    const [
        tagsFilter,
        tagsChip,
        selectedTags,
        setSelectedTags,
        filterTagsBy
    ] = useTagsFilter(allTags, allTagsLoaded, additionalTagsCount, () => dispatch(toggleTagModal(true)));
    const onRefreshData = useCallback((options) => dispatch(loadSystems(options, showTags)));

    const updateData = (config) => {
        const params = {
            page,
            per_page: perPage,
            filters,
            ...config
        };
        onRefresh ? onRefresh(params, (options) => {
            dispatch(entitiesLoading());
            onRefreshData({ ...params, ...options });
        }) : onRefreshData(...params);
    };

    const debouncedRefresh = useCallback(debounce((config) => updateData(config), 800));
    const debounceGetAllTags = useCallback(debounce((config, options) => {
        if (showTags && !hasItems) {
            dispatch(fetchAllTags(config, options));
        }
    }, 800), []);

    useEffect(() => {
        const { textFilter, tagFilters, staleFilter, registeredWithFilter } = reduceFilters(filters);
        ReactDOM.unstable_batchedUpdates(() => {
            setTextFilter(textFilter);
            setStaleFilter(staleFilter);
            setRegisteredWithFilter(registeredWithFilter);
            setSelectedTags(tagFilters);
        });
    }, []);

    const onSetTextFilter = (value, debounced = true) => {
        const textualFilter = filters.find(oneFilter => oneFilter.value === TEXT_FILTER);
        if (textualFilter) {
            textualFilter.filter = value;
        } else {
            filters.push({ value: TEXT_FILTER, filter: value });
        }

        const refresh = debounced ? debouncedRefresh : updateData;
        refresh({ page: 1, perPage, filters });
    };

    const onSetFilter = (value, filterKey, refresh) => {
        const newFilters = [
            ...filters.filter(oneFilter => !oneFilter.hasOwnProperty(filterKey)),
            { [filterKey]: value }
        ];
        refresh({ page: 1, perPage, filters: newFilters });
    };

    const applyTags = (newSelection, debounced = true) => {
        const refresh = debounced ? debouncedRefresh : updateData;
        const tagFilters = mapGroups(newSelection);
        const newFilters = [
            ...filters.filter(oneFilter => !oneFilter.hasOwnProperty('tagFilters')),
            { tagFilters }
        ];
        refresh({
            page: 1,
            perPage,
            filters: newFilters
        });

        return newFilters;
    };

    useEffect(() => {
        if (showTags && !hasItems) {
            debounceGetAllTags(filterTagsBy, { filters });
        }
    }, [ filterTagsBy ]);

    useEffect(() => {
        onSetTextFilter(textFilter, true);
    }, [ textFilter ]);

    useEffect(() => {
        onSetFilter(staleFilter, 'staleFilter', debouncedRefresh);
    }, [ staleFilter ]);

    useEffect(() => {
        onSetFilter(registeredWithFilter, 'registeredWithFilter', debouncedRefresh);
    }, [ registeredWithFilter ]);

    useEffect(() => {
        if (showTags && !hasItems) {
            const newFilters = applyTags(selectedTags, true);
            debounceGetAllTags(filterTagsBy, { filters: newFilters });
        }
    }, [ selectedTags ]);

    const deleteMapper = {
        [TEXTUAL_CHIP]: () => setTextFilter(''),
        [TAG_CHIP]: (deleted) => setSelectedTags(onDeleteTag(deleted, selectedTags, applyTags)),
        [STALE_CHIP]: (deleted) => setStaleFilter(onDeleteFilter(deleted, staleFilter)),
        [REGISTERED_CHIP]: (deleted) => setRegisteredWithFilter(
            onDeleteFilter(deleted, registeredWithFilter)
        )
    };

    const constructFilters = () => {
        return {
            filters: [
                ...(showTags && !hasItems) ? tagsChip : [],
                ...!hasItems ? nameChip : [],
                ...!hasItems ? stalenessChip : [],
                ...!hasItems ? registeredChip : [],
                ...(activeFiltersConfig && activeFiltersConfig.filters) || []
            ],
            onDelete: (e, [ deleted, ...restDeleted ], isAll) => {
                if (isAll) {
                    updateData({ page: 1, perPage, filters: [] });
                    dispatch(clearFilters());
                    ReactDOM.unstable_batchedUpdates(() => {
                        setTextFilter('');
                        setStaleFilter([]);
                        setRegisteredWithFilter([]);
                        setSelectedTags({});
                    });
                } else if (deleted.type) {
                    deleteMapper[deleted.type](deleted);
                }

                activeFiltersConfig && activeFiltersConfig.onDelete && activeFiltersConfig.onDelete(e, [ deleted, ...restDeleted ], isAll);
            }
        };
    };

    const isFilterSelected = () => {
        return textFilter.length > 0 || flatMap(
            Object.values(selectedTags),
            (value) => Object.values(value).filter(Boolean)
        ).filter(Boolean).length > 0 ||
        (staleFilter?.length > 0) ||
        (registeredWithFilter?.length > 0) ||
        (activeFiltersConfig && activeFiltersConfig.filters && activeFiltersConfig.filters.length > 0);
    };

    const inventoryFilters = [
        ...!hasItems ? [
            nameFilter,
            stalenessFilter,
            registeredFilter,
            ...showTags ? [ tagsFilter ] : []
        ] : [],
        ...(filterConfig && filterConfig.items) || []
    ];
    return <Fragment>
        <PrimaryToolbar
            {...props}
            className={`ins-c-inventory__table--toolbar ${hasItems ? 'ins-c-inventory__table--toolbar-has-items' : ''}`}
            {...inventoryFilters.length > 0 && {
                filterConfig: {
                    ...filterConfig || {},
                    items: inventoryFilters
                }
            }}
            { ...isFilterSelected() && { activeFiltersConfig: constructFilters() } }
            actionsConfig={ loaded ? actionsConfig : null }
            pagination={loaded ? {
                page,
                itemCount: total,
                perPage,
                onSetPage: (_e, newPage) => updateData({ page: newPage, per_page: perPage, filters }),
                onPerPageSelect: (_e, newPerPage) => updateData({ page: 1, per_page: newPerPage, filters })
            } : <Skeleton size={SkeletonSize.lg} />}
        >
            { children }
        </PrimaryToolbar>
        { showTags && <TagsModal onApply={(selected) => setSelectedTags(arrayToSelection(selected))} /> }
    </Fragment>;
};

EntityTableToolbar.propTypes = {
    showTags: PropTypes.bool,
    filterConfig: PropTypes.shape(PrimaryToolbar.propTypes.filterConfig),
    total: PropTypes.number,
    filters: PropTypes.array,
    hasItems: PropTypes.bool,
    page: PropTypes.number,
    onClearFilters: PropTypes.func,
    toggleTagModal: PropTypes.func,
    perPage: PropTypes.number,
    children: PropTypes.node,
    pagination: PrimaryToolbar.propTypes.pagination,
    actionsConfig: PrimaryToolbar.propTypes.actionsConfig,
    activeFiltersConfig: PrimaryToolbar.propTypes.activeFiltersConfig,
    onRefreshData: PropTypes.func
};

EntityTableToolbar.defaultProps = {
    showTags: false,
    activeFiltersConfig: {},
    filters: []
};

export default EntityTableToolbar;
