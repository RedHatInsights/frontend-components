/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { SkeletonSize, Skeleton } from '@redhat-cloud-services/frontend-components/components/esm/Skeleton';
import { PrimaryToolbar } from '@redhat-cloud-services/frontend-components/components/esm/PrimaryToolbar';
import { Spinner } from '@patternfly/react-core';
import { fetchAllTags, clearFilters, entitiesLoading, toggleTagModal } from './redux/actions';
import debounce from 'lodash/debounce';
import { InventoryContext } from './Inventory';
import {
    mapGroups,
    TEXT_FILTER,
    reduceFilters,
    tagsFilterBuilder,
    TEXTUAL_CHIP,
    STALE_CHIP,
    REGISTERED_CHIP,
    TAG_CHIP,
    mergeTableProps,
    staleness,
    registered,
    arrayToSelection
} from './constants';
import flatMap from 'lodash/flatMap';
import TagsModal from './TagsModal';

class ContextEntityTableToolbar extends Component {
    state = {
        textFilter: '',
        selected: {},
        filterTagsBy: '',
        staleFilter: [],
        registeredWithFilter: []
    }

    updateData = (config) => {
        const { onRefresh, onRefreshData, perPage, filters, page, showTags, getAllTags } = this.props;
        const params = {
            page,
            per_page: perPage,
            filters,
            ...config
        };
        onRefresh ? onRefresh(params) : onRefreshData(params);
        if (showTags) {
            getAllTags('', { filters: config.filters });
        }
    }

    debouncedRefresh = debounce((config) => this.updateData(config), 800);

    debounceGetAllTags = debounce((config, options) => this.props.getAllTags(config, options), 800);

    componentDidMount() {
        const { filters, hasItems, showTags } = this.props;
        if (showTags && !hasItems) {
            this.props.getAllTags();
        }

        const { textFilter, tagFilters, staleFilter, registeredWithFilter } = reduceFilters(filters);
        this.setState({
            textFilter,
            selected: tagFilters,
            staleFilter,
            registeredWithFilter
        });
    }

    onSetTextFilter = (value, debounced = true) => {
        const { perPage, filters = [] } = this.props;
        const textualFilter = filters.find(oneFilter => oneFilter.value === TEXT_FILTER);
        if (textualFilter) {
            textualFilter.filter = value;
        } else {
            filters.push({ value: TEXT_FILTER, filter: value });
        }

        const refresh = debounced ? this.debouncedRefresh : this.updateData;
        this.setState({ textFilter: value }, () => refresh({ page: 1, perPage, filters }));
    }

    onSetFilter = (value, filterKey, debounced = true) => {
        const { perPage, filters = [] } = this.props;
        const refresh = debounced ? this.debouncedRefresh : this.updateData;
        const newFilters = [
            ...filters.filter(oneFilter => !oneFilter.hasOwnProperty(filterKey)),
            { [filterKey]: value }
        ];
        this.setState({ filterTagsBy: '', [filterKey]: value }, () => refresh({ page: 1, perPage, filters: newFilters }));
    }

    applyTags = (newSelection, debounced = true) => {
        const { perPage, filters } = this.props;
        const tagFilters = mapGroups(newSelection);

        const refresh = debounced ? this.debouncedRefresh : this.updateData;
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
    }

    updateSelectedTags = (newSelection, debounce = true) => {
        this.setState(
            { filterTagsBy: '', selected: newSelection },
            () => this.applyTags(newSelection, debounce)
        );
    }

    createTagsFilter = () => {
        const { allTags, allTagsLoaded, additionalTagsCount, filters, toggleTagModal } = this.props;
        const { selected, filterTagsBy } = this.state;
        return tagsFilterBuilder(
            (value) => this.setState(
                { filterTagsBy: value },
                () => this.debounceGetAllTags(value, { filters })
            ),
            filterTagsBy,
            this.updateSelectedTags,
            selected,
            allTagsLoaded,
            allTags,
            additionalTagsCount > 0 ? [{
                label: '',
                items: [{
                    label: `${additionalTagsCount} more tags available`,
                    onClick: () => toggleTagModal(),
                    className: 'ins-c-inventory__tags-more-items'
                }]
            }] : [],
            <span> <Spinner size="md" /> </span>
        );
    }

    onDeleteTag = (deleted) => {
        const { selected } = this.state;
        const deletedItem = deleted.chips[0];
        selected[deleted.key][deletedItem.key] = false;
        this.updateSelectedTags(selected, false);
    }

    onDeleteFilter = (deleted, filterType) => {
        const { value: deletedItem } = deleted.chips[0];
        const newFilter = this.state[filterType].filter((item) => item !== deletedItem);
        this.onSetFilter(newFilter, filterType, false);
    }

    deleteMapper = {
        [TEXTUAL_CHIP]: () => this.onSetTextFilter('', false),
        [TAG_CHIP]: this.onDeleteTag,
        [STALE_CHIP]: (deleted) => this.onDeleteFilter(deleted, 'staleFilter'),
        [REGISTERED_CHIP]: (deleted) => this.onDeleteFilter(deleted, 'registeredWithFilter')
    }

    constructFilters = () => {
        const { perPage, onClearFilters, activeFiltersConfig, hasItems } = this.props;
        const { selected, textFilter, staleFilter, registeredWithFilter } = this.state;
        return {
            filters: [
                ...mapGroups(selected, 'chips'),
                ...textFilter.length > 0 ? [{
                    category: 'Display name',
                    type: TEXTUAL_CHIP,
                    chips: [
                        { name: textFilter }
                    ]
                }] : [],
                ...!hasItems && staleFilter && staleFilter.length > 0 ? [{
                    category: 'Status',
                    type: STALE_CHIP,
                    chips: staleness.filter(({ value }) => staleFilter.includes(value))
                    .map(({ label, ...props }) => ({ name: label, ...props }))
                }] : [],
                ...!hasItems && registeredWithFilter && registeredWithFilter.length > 0 ? [{
                    category: 'Source',
                    type: REGISTERED_CHIP,
                    chips: registered.filter(({ value }) => registeredWithFilter.includes(value))
                    .map(({ label, ...props }) => ({ name: label, ...props }))
                }] : [],
                ...(activeFiltersConfig && activeFiltersConfig.filters) || []
            ],
            onDelete: (e, [ deleted, ...restDeleted ], isAll) => {
                if (isAll) {
                    this.updateData({ page: 1, perPage, filters: [] });
                    onClearFilters();
                    this.setState({
                        selected: {},
                        textFilter: '',
                        staleFilter: [],
                        registeredWithFilter: [],
                        filterTagsBy: ''
                    });
                } else if (deleted.type) {
                    this.deleteMapper[deleted.type](deleted);
                }

                activeFiltersConfig && activeFiltersConfig.onDelete && activeFiltersConfig.onDelete(e, [ deleted, ...restDeleted ], isAll);
            }
        };
    }

    isFilterSelected = () => {
        const { activeFiltersConfig } = this.props;
        const { selected, textFilter, staleFilter, registeredWithFilter } = this.state;
        return textFilter.length > 0 || flatMap(
            Object.values(selected),
            (value) => Object.values(value).filter(Boolean)
        ).filter(Boolean).length > 0 ||
        (staleFilter && staleFilter.length > 0) ||
        (registeredWithFilter && registeredWithFilter.length > 0) ||
        (activeFiltersConfig && activeFiltersConfig.filters && activeFiltersConfig.filters.length > 0);
    }

    render() {
        const {
            total,
            page,
            onRefreshData,
            perPage,
            filters,
            filterConfig,
            hasItems,
            pathPrefix,
            apiBase,
            children,
            loaded,
            actionsConfig,
            allTags,
            onRefresh,
            onClearFilters,
            getAllTags,
            allTagsLoaded,
            totalItems,
            hasCheckbox,
            activeFiltersConfig,
            additionalTagsCount,
            showTags,
            ...props
        } = this.props;
        const inventoryFilters = [
            ...!hasItems ? [{
                label: 'Name',
                value: 'name-filter',
                filterValues: {
                    placeholder: 'Filter by name',
                    value: this.state.textFilter,
                    onChange: (_e, value) => this.onSetTextFilter(value)
                }
            }, {
                label: 'Status',
                value: 'stale-status',
                type: 'checkbox',
                filterValues: {
                    value: this.state.staleFilter,
                    onChange: (_e, value) => this.onSetFilter(value, 'staleFilter'),
                    items: staleness
                }
            },
            {
                label: 'Source',
                value: 'source-registered-with',
                type: 'checkbox',
                filterValues: {
                    value: this.state.registeredWithFilter,
                    onChange: (_e, value) => this.onSetFilter(value, 'registeredWithFilter'),
                    items: registered
                }
            }] : [],
            ...(showTags && !hasItems) ? [ this.createTagsFilter() ] : [],
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
                { ...this.isFilterSelected() && { activeFiltersConfig: this.constructFilters() } }
                actionsConfig={ loaded ? actionsConfig : null }
                pagination={loaded ? {
                    page,
                    itemCount: total,
                    perPage,
                    onSetPage: (_e, newPage) => this.updateData({ page: newPage, per_page: perPage, filters }),
                    onPerPageSelect: (_e, newPerPage) => this.updateData({ page: 1, per_page: newPerPage, filters })
                } : <Skeleton size={SkeletonSize.lg} />}
            >
                { children }
            </PrimaryToolbar>
            { showTags && <TagsModal onApply={(selected) => this.updateSelectedTags(arrayToSelection(selected))} /> }
        </Fragment>;
    }
}

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
    pathPrefix: PropTypes.number,
    additionalTagsCount: PropTypes.number,
    apiBase: PropTypes.string,
    page: PropTypes.number,
    getAllTags: PropTypes.func,
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
    allTags: [],
    getAllTags: () => undefined,
    onClearFilters: () => undefined
};

function mapStateToProps(
    { entities: { page, perPage, total, loaded, activeFilters, allTags, allTagsLoaded, additionalTagsCount } },
    { totalItems, page: currPage, perPage: currPerPage, hasItems, onRefresh, isLoaded }) {
    return {
        page: hasItems ? currPage : page,
        perPage: hasItems ? currPerPage : perPage,
        total: hasItems ? totalItems : total,
        hasItems,
        loaded: hasItems && isLoaded !== undefined ? (isLoaded && loaded) : loaded,
        allTagsLoaded,
        allTags,
        filters: activeFilters,
        additionalTagsCount,
        onRefresh
    };
}

export default connect(mapStateToProps, (dispatch, { showTags, hasItems }) => ({
    getAllTags: (search, options) => {
        if (showTags && !hasItems) {
            dispatch(fetchAllTags(search, options));
        }
    },
    onClearFilters: () => dispatch(clearFilters()),
    onRefresh: () => dispatch(entitiesLoading()),
    toggleTagModal: () => dispatch(toggleTagModal(true))
}), mergeTableProps)(EntityTableToolbar);
