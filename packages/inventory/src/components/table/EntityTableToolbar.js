/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
import React, { Fragment, useEffect, useReducer, useCallback } from 'react';
import { connect, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { Skeleton, SkeletonSize } from '@redhat-cloud-services/frontend-components/components/esm/Skeleton';
import { PrimaryToolbar } from '@redhat-cloud-services/frontend-components/components/esm/PrimaryToolbar';
import { Spinner } from '@patternfly/react-core/dist/esm/components/Spinner';
import { fetchAllTags, clearFilters, entitiesLoading, toggleTagModal } from '../../redux/actions';
import debounce from 'lodash/debounce';
import flatMap from 'lodash/flatMap';
import {
    TagsModal,
    mapGroups,
    TEXT_FILTER,
    reduceFilters,
    tagsFilterBuilder,
    TEXTUAL_CHIP,
    STALE_CHIP,
    REGISTERED_CHIP,
    TAG_CHIP,
    staleness,
    registered,
    arrayToSelection,
    InventoryContext
} from '../../shared';
import { stateMapper } from './helpers';

const ContextEntityTableToolbar = ({
    total,
    page,
    onRefreshData,
    perPage,
    filters,
    filterConfig,
    hasItems,
    children,
    loaded,
    actionsConfig,
    allTags,
    onRefresh,
    allTagsLoaded,
    hasCheckbox,
    activeFiltersConfig,
    additionalTagsCount,
    showTags,
    ...props
}) => {
    const dispatch = useDispatch();
    const [ state, setState ] = useReducer(
        (state, action) => stateMapper?.[action.type]?.(state, action) || state,
        {
            textFilter: '',
            selected: {},
            filterTagsBy: '',
            staleFilter: [],
            registeredWithFilter: []
        }
    );

    const updateData = (config) => {
        const params = {
            page,
            per_page: perPage,
            filters,
            ...config
        };
        onRefresh ? onRefresh(params, (options) => {
            dispatch(entitiesLoading());
            onRefreshData(options);
        }) : onRefreshData(params);
        if (showTags && !hasItems) {
            dispatch(fetchAllTags('', { filters: config.filters }));
        }
    };

    const debouncedRefresh = useCallback(debounce((config) => updateData(config), 800), [ onRefreshData ]);
    const debounceGetAllTags = useCallback(debounce((config, options) => {
        if (showTags && !hasItems) {
            dispatch(fetchAllTags(config, options));
        }
    }, 800), []);
    useEffect(() => {
        if (showTags && !hasItems) {
            dispatch(fetchAllTags());
        }

        const { textFilter, tagFilters, staleFilter, registeredWithFilter } = reduceFilters(filters);
        setState({
            type: 'batchUpdate',
            payload: {
                textFilter,
                selected: tagFilters,
                staleFilter,
                registeredWithFilter
            }
        });
    }, []);

    const onSetTextFilter = (value, debounced = true) => {
        const textualFilter = filters.find(oneFilter => oneFilter.value === TEXT_FILTER);
        if (textualFilter) {
            textualFilter.filter = value;
        } else {
            filters.push({ value: TEXT_FILTER, filter: value });
        }

        setState({
            type: 'setTextFilter',
            payload: value
        });
        const refresh = debounced ? debouncedRefresh : updateData;
        refresh({ page: 1, perPage, filters });
    };

    const onSetFilter = (value, filterKey, debounced = true) => {
        const newFilters = [
            ...filters.filter(oneFilter => !oneFilter.hasOwnProperty(filterKey)),
            { [filterKey]: value }
        ];
        setState({
            type: 'batchUpdate',
            payload: { filterTagsBy: '', [filterKey]: value }
        });
        const refresh = debounced ? debouncedRefresh : updateData;
        refresh({ page: 1, perPage, filters: newFilters });
    };

    const applyTags = (newSelection, debounced = true) => {
        const tagFilters = mapGroups(newSelection);

        const refresh = debounced ? debouncedRefresh : updateData;
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

    const updateSelectedTags = (newSelection, debounce = true) => {
        setState({
            type: 'batchUpdate',
            payload: { filterTagsBy: '', selected: newSelection }
        });
        applyTags(newSelection, debounce);
    };

    const createTagsFilter = () => {
        return tagsFilterBuilder(
            (value) => {
                setState({
                    type: 'setFilterTagsBy',
                    payload: value
                });
                debounceGetAllTags(value, { filters });
            },
            state.filterTagsBy,
            updateSelectedTags,
            state.selected,
            allTagsLoaded,
            allTags,
            additionalTagsCount > 0 ? [{
                label: '',
                items: [{
                    label: `${additionalTagsCount} more tags available`,
                    onClick: () => dispatch(toggleTagModal(true)),
                    className: 'ins-c-inventory__tags-more-items'
                }]
            }] : [],
            <span> <Spinner size="md" /> </span>
        );
    };

    const onDeleteTag = (deleted) => {
        const deletedItem = deleted.chips[0];
        state.selected[deleted.key][deletedItem.key] = false;
        updateSelectedTags(state.selected, false);
    };

    const onDeleteFilter = (deleted, filterType) => {
        const { value: deletedItem } = deleted.chips[0];
        const newFilter = state[filterType].filter((item) => item !== deletedItem);
        onSetFilter(newFilter, filterType, false);
    };

    const deleteMapper = {
        [TEXTUAL_CHIP]: () => onSetTextFilter('', false),
        [TAG_CHIP]: onDeleteTag,
        [STALE_CHIP]: (deleted) => onDeleteFilter(deleted, 'staleFilter'),
        [REGISTERED_CHIP]: (deleted) => onDeleteFilter(deleted, 'registeredWithFilter')
    };

    const constructFilters = () => {
        return {
            filters: [
                ...mapGroups(state.selected, 'chips'),
                ...state.textFilter.length > 0 ? [{
                    category: 'Display name',
                    type: TEXTUAL_CHIP,
                    chips: [
                        { name: state.textFilter }
                    ]
                }] : [],
                ...!hasItems && state.staleFilter && state.staleFilter.length > 0 ? [{
                    category: 'Status',
                    type: STALE_CHIP,
                    chips: staleness.filter(({ value }) => state.staleFilter.includes(value))
                    .map(({ label, ...props }) => ({ name: label, ...props }))
                }] : [],
                ...!hasItems && state.registeredWithFilter && state.registeredWithFilter.length > 0 ? [{
                    category: 'Source',
                    type: REGISTERED_CHIP,
                    chips: registered.filter(({ value }) => state.registeredWithFilter.includes(value))
                    .map(({ label, ...props }) => ({ name: label, ...props }))
                }] : [],
                ...(activeFiltersConfig && activeFiltersConfig.filters) || []
            ],
            onDelete: (e, [ deleted, ...restDeleted ], isAll) => {
                if (isAll) {
                    updateData({ page: 1, perPage, filters: [] });
                    dispatch(clearFilters());
                    setState({
                        type: 'batchUpdate',
                        payload: {
                            selected: {},
                            textFilter: '',
                            staleFilter: [],
                            registeredWithFilter: [],
                            filterTagsBy: ''
                        }
                    });
                } else if (deleted.type) {
                    deleteMapper[deleted.type](deleted);
                }

                activeFiltersConfig && activeFiltersConfig.onDelete && activeFiltersConfig.onDelete(e, [ deleted, ...restDeleted ], isAll);
            }
        };
    };

    const isFilterSelected = () => {
        return state.textFilter.length > 0 || flatMap(
            Object.values(state.selected),
            (value) => Object.values(value).filter(Boolean)
        ).filter(Boolean).length > 0 ||
        (state.staleFilter && state.staleFilter.length > 0) ||
        (state.registeredWithFilter && state.registeredWithFilter.length > 0) ||
        (activeFiltersConfig && activeFiltersConfig.filters && activeFiltersConfig.filters.length > 0);
    };

    const inventoryFilters = [
        ...!hasItems ? [{
            label: 'Name',
            value: 'name-filter',
            filterValues: {
                placeholder: 'Filter by name',
                value: state.textFilter,
                onChange: (_e, value) => onSetTextFilter(value)
            }
        }, {
            label: 'Status',
            value: 'stale-status',
            type: 'checkbox',
            filterValues: {
                value: state.staleFilter,
                onChange: (_e, value) => onSetFilter(value, 'staleFilter'),
                items: staleness
            }
        },
        {
            label: 'Source',
            value: 'source-registered-with',
            type: 'checkbox',
            filterValues: {
                value: state.registeredWithFilter,
                onChange: (_e, value) => onSetFilter(value, 'registeredWithFilter'),
                items: registered
            }
        }] : [],
        ...(showTags && !hasItems) ? [ createTagsFilter() ] : [],
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
        { showTags && <TagsModal onApply={(selected) => updateSelectedTags(arrayToSelection(selected))} /> }
    </Fragment>;
};

const EntityTableToolbar = ({ ...props }) => (
    <InventoryContext.Consumer>
        {({ onRefreshData }) => (
            <ContextEntityTableToolbar {...props} onRefreshData={onRefreshData} />
        )}
    </InventoryContext.Consumer>
);

EntityTableToolbar.propTypes = {
    showTags: PropTypes.bool,
    filterConfig: PropTypes.shape(PrimaryToolbar.propTypes.filterConfig),
    total: PropTypes.number,
    filters: PropTypes.array,
    hasItems: PropTypes.bool,
    additionalTagsCount: PropTypes.number,
    page: PropTypes.number,
    onClearFilters: PropTypes.func,
    toggleTagModal: PropTypes.func,
    perPage: PropTypes.number,
    children: PropTypes.node,
    pagination: PrimaryToolbar.propTypes.pagination,
    loaded: PropTypes.bool,
    allTagsLoaded: PropTypes.bool,
    allTags: PropTypes.array,
    actionsConfig: PrimaryToolbar.propTypes.actionsConfig,
    activeFiltersConfig: PrimaryToolbar.propTypes.activeFiltersConfig
};

ContextEntityTableToolbar.propTypes = {
    ...EntityTableToolbar.propTypes,
    onRefreshData: PropTypes.func
};

EntityTableToolbar.defaultProps = {
    showTags: false,
    activeFiltersConfig: {},
    filters: [],
    allTags: []
};

function mapStateToProps(
    { entities: { loaded, activeFilters, allTags, allTagsLoaded, additionalTagsCount } },
    { hasItems, isLoaded }) {
    return {
        hasItems,
        loaded: hasItems && isLoaded !== undefined ? (isLoaded && loaded) : loaded,
        allTagsLoaded,
        allTags,
        filters: activeFilters,
        additionalTagsCount
    };
}

export default connect(mapStateToProps)(EntityTableToolbar);
