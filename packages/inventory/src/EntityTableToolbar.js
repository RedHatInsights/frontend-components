/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Skeleton, SkeletonSize, PrimaryToolbar } from '@redhat-cloud-services/frontend-components';
import { fetchAllTags, clearFilters } from './redux/actions';
import debounce from 'lodash/debounce';
import { InventoryContext } from './Inventory';
import {
    mapGroups,
    TEXT_FILTER,
    reduceFilters,
    constructGroups,
    TEXTUAL_CHIP,
    TAG_CHIP
} from './constants';
import flatMap from 'lodash/flatMap';

class ContextEntityTableToolbar extends Component {
    state = {
        textFilter: '',
        selected: {}
    }

    debouncedRefresh = debounce((config) => {
        this.props.onRefreshData && this.props.onRefreshData(config);
    }, 800);

    componentDidMount() {
        const { filters } = this.props;
        this.props.getAllTags();
        const { textFilter, tagFilters } = reduceFilters(filters);
        this.setState({
            textFilter: textFilter,
            selected: tagFilters
        });
    }

    onSetTextFilter = (value) => {
        const { page, perPage, filters } = this.props;
        const textualFilter = filters.find(oneFilter => oneFilter.value === TEXT_FILTER);
        if (textualFilter) {
            textualFilter.filter = value;
        } else {
            filters.push({ value: TEXT_FILTER, filter: value });
        }

        this.debouncedRefresh({ page: 1, perPage, filters });
        this.setState({ textFilter: value });
    }

    applyTags = (newSelection, debounced = true) => {
        const { allTags, page, perPage, filters, onRefreshData } = this.props;
        const tagFilters = mapGroups(newSelection, allTags);
        const tagFiltersIndex = filters.findIndex((value) => value.hasOwnProperty('tagFilters'));
        filters.splice(tagFiltersIndex, 1);
        const refresh = debounced ? this.debouncedRefresh : onRefreshData;
        refresh({
            page: 1,
            perPage,
            filters: [
                ...filters,
                { tagFilters }
            ]
        });
    }

    createTagsFilter = () => {
        const { allTags } = this.props;
        const { selected } = this.state;
        return {
            label: 'Tags',
            value: 'tags',
            type: 'group',
            placeholder: 'Filter system by tag',
            filterValues: {
                onChange: (e, newSelection) => this.setState(
                    { selected: newSelection },
                    () =>  this.applyTags(newSelection)
                ),
                selected,
                groups: constructGroups(allTags)
            }
        };
    }

    constructFilters = () => {
        const { allTags, perPage, onRefreshData, onClearFilters, activeFiltersConfig } = this.props;
        const { selected, textFilter } = this.state;
        return {
            filters: [
                ...mapGroups(selected, allTags, 'chips'),
                ...textFilter.length > 0 ? [{
                    category: 'Display name',
                    type: TEXTUAL_CHIP,
                    chips: [
                        { name: textFilter }
                    ]
                }] : [],
                ...(activeFiltersConfig && activeFiltersConfig.filters) || []
            ],
            onDelete: (e, [ deleted ], isAll) => {
                if (isAll) {
                    onRefreshData({ page: 1, perPage, filters: [] });
                    onClearFilters();
                    this.setState({
                        selected: {},
                        textFilter: ''
                    });
                } else {
                    if (deleted.type === TEXTUAL_CHIP) {
                        onRefreshData({ page: 1, perPage, filters: mapGroups(selected, allTags) });
                    } else if (deleted.type === TAG_CHIP) {
                        const deletedItem = deleted.chips[0];
                        selected[deleted.key][deletedItem.key] = false;
                        this.setState({ selected }, () => this.applyTags(selected, false));
                    }
                }

                activeFiltersConfig && activeFiltersConfig.onDelete(e, deleted, isAll);
            }
        };
    }

    isFilterSelected = () => {
        const { activeFiltersConfig } = this.props;
        const { selected, textFilter } = this.state;
        return textFilter.length > 0 || flatMap(
            Object.values(selected),
            (value) => Object.values(value).filter(Boolean)
        ).filter(Boolean).length > 0 ||
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
            ...props
        } = this.props;
        const inventoryFilters = [
            ...!hasItems ? [{
                label: 'Name',
                value: 'name-filter',
                filterValues: {
                    placeholder: 'Find system by name',
                    value: this.state.textFilter,
                    onChange: (_e, value) => this.onSetTextFilter(value)
                }
            }] : [],
            ...(localStorage.getItem('rhcs-tags') && !hasItems) ? [ this.createTagsFilter() ] : [],
            ...(filterConfig && filterConfig.items) || []
        ];
        return <PrimaryToolbar
            {...props}
            className="ins-c-inventory__table--toolbar"
            {...inventoryFilters.length > 0 && {
                filterConfig: {
                    ...filterConfig || {},
                    items: inventoryFilters
                }
            }}
            { ...this.isFilterSelected() && { activeFiltersConfig: this.constructFilters() } }
            actionsConfig={ loaded ? actionsConfig : <Skeleton size={SkeletonSize.lg} /> }
            pagination={loaded ? {
                page,
                itemCount: total,
                perPage,
                onSetPage: (_e, newPage) => onRefreshData({ page: newPage, perPage, filters }),
                // eslint-disable-next-line camelcase
                onPerPageSelect: (_e, newPerPage) => onRefreshData({ page: 1, per_page: newPerPage, filters })
            } : <Skeleton size={SkeletonSize.lg} />}
        >
            { children }
        </PrimaryToolbar>;
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
    filterConfig: PropTypes.shape(PrimaryToolbar.propTypes.filterConfig),
    total: PropTypes.number,
    filters: PropTypes.array,
    hasItems: PropTypes.bool,
    pathPrefix: PropTypes.number,
    apiBase: PropTypes.string,
    page: PropTypes.number,
    getAllTags: PropTypes.func,
    onClearFilters: PropTypes.func,
    perPage: PropTypes.number,
    children: PropTypes.node,
    pagination: PrimaryToolbar.propTypes.pagination,
    loaded: PropTypes.bool,
    allTagsLoaded: PropTypes.bool,
    allTags: PropTypes.array,
    actionsConfig: PrimaryToolbar.propTypes.actionsConfig,
    activeFiltersConfig: PrimaryToolbar.propTypes.activeFilters
};

ContextEntityTableToolbar.propTypes = {
    ...EntityTableToolbar.propTypes,
    onRefreshData: PropTypes.func
};

EntityTableToolbar.defaultProps = {
    activeFiltersConfig: {},
    filters: [],
    allTags: [],
    onRefresh: () => undefined,
    getAllTags: () => undefined,
    onClearFilters: () => undefined
};

function mapStateToProps(
    { entities: { page, perPage, total, loaded, activeFilters, allTags, allTagsLoaded } },
    { totalItems, page: currPage, perPage: currPerPage, hasItems }) {
    return {
        page: hasItems ? currPage : page,
        perPage: hasItems ? currPerPage : perPage,
        total: hasItems ? totalItems : total,
        loaded,
        allTagsLoaded,
        allTags,
        filters: activeFilters
    };
}

export default connect(mapStateToProps, (dispatch) => ({
    getAllTags: () => dispatch(fetchAllTags()),
    onClearFilters: () => dispatch(clearFilters())
}))(EntityTableToolbar);
