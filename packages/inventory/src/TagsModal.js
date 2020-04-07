import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { toggleTagModal, fetchAllTags, loadTags } from './redux/actions';
import { TagModal } from '@redhat-cloud-services/frontend-components';
import debounce from 'lodash/debounce';

class TagsModal extends React.Component {
    state = {
        filterTagsBy: '',
        selected: [],
        showAllTags: false
    }
    componentDidUpdate(prevProps) {
        const { showTagDialog, activeSystemTag, fetchAllTags } = this.props;
        if (prevProps.showTagDialog !== showTagDialog && activeSystemTag === undefined) {
            this.setState({ showAllTags: true });
            fetchAllTags();
        }
    }

    debouncedFetch = debounce((pagination) => this.fetchTags(pagination), 700);

    fetchTags = (pagination) => {
        const { showAllTags, filterTagsBy } = this.state;
        const { fetchAllTags, fetchTagsForSystem, activeSystemTag, tagsCount } = this.props;
        if (showAllTags) {
            fetchAllTags(filterTagsBy, { pagination });
        } else {
            fetchTagsForSystem(activeSystemTag.id, filterTagsBy, { pagination }, tagsCount);
        }
    };

    render() {
        const { showTagDialog, tags, activeSystemTag, tagsCount, onToggleTagModal, pagination } = this.props;
        const { filterTagsBy, selected, showAllTags } = this.state;
        const loaded = showAllTags ? false : activeSystemTag.tagsLoaded;
        return (
            <React.Fragment>
                <TagModal
                    tableProps={{
                        canSelectAll: false
                    }}
                    {...loaded && {
                        loaded,
                        pagination: {
                            ...pagination,
                            count: tagsCount
                        },
                        rows: tags.map(({ key, value, namespace }) => ({
                            id: `${namespace}/${key}=${value}`,
                            selected: selected.find(({ id }) => id === `${namespace}/${key}=${value}`),
                            cells: [ key, value, namespace ]
                        }))
                    }}
                    loaded={ loaded }
                    width="auto"
                    isOpen={ showTagDialog }
                    toggleModal={() => {
                        this.setState({
                            selected: [],
                            filterTagsBy: '',
                            showAllTags: false
                        });
                        onToggleTagModal();
                    }}
                    filters={[
                        {
                            label: 'Tags filter',
                            placeholder: 'Filter tags',
                            value: 'tags-filter',
                            filterValues: {
                                value: filterTagsBy,
                                onChange: (_e, value) => {
                                    this.debouncedFetch(pagination);
                                    this.setState({ filterTagsBy: value });
                                }
                            }
                        }
                    ]}
                    onUpdateData={ this.fetchTags }
                    columns={ [
                        { title: 'Name' },
                        { title: 'Value' },
                        { title: 'Tag Sources' }
                    ] }
                    {...showAllTags && {
                        onSelect: (selected) => this.setState({ selected }),
                        selected
                    }}
                    systemName={ activeSystemTag ?
                        `${activeSystemTag.display_name} (${tagsCount})` :
                        `All tags in inventory (${tagsCount})`
                    }
                />
            </React.Fragment>
        );
    }
}

TagsModal.propTypes = {
    showTagDialog: PropTypes.bool,
    tags: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.node,
        namespace: PropTypes.node
    })),
    tagsCount: PropTypes.number,
    activeSystemTag: PropTypes.shape({
        id: PropTypes.string,
        // eslint-disable-next-line camelcase
        display_name: PropTypes.string
    }),
    pagination: PropTypes.shape({
        page: PropTypes.number,
        perPage: PropTypes.number
    }),
    onToggleTagModal: PropTypes.func,
    fetchAllTags: PropTypes.func
};

TagsModal.defaultProps = {
    showTagDialog: false,
    tagsCount: 0,
    onToggleTagModal: () => undefined,
    fetchAllTags: () => undefined
};

export default connect(({ entities, entityDetails }) => {
    const { showTagDialog, activeSystemTag = {} } = entities || entityDetails || {};
    return ({
        showTagDialog,
        tags: activeSystemTag && activeSystemTag.tags,
        activeSystemTag,
        tagsCount: activeSystemTag && activeSystemTag.tagsCount,
        pagination: activeSystemTag ? {
            page: activeSystemTag.page,
            perPage: activeSystemTag.perPage
        } : {
            page: 1,
            perPage: 10
        }
    });
}, (dispatch) => ({
    onToggleTagModal: () => dispatch(toggleTagModal(false)),
    fetchAllTags: (search, options) => dispatch(fetchAllTags(search, options)),
    fetchTagsForSystem: (systemId, search, options, tagsCount) => dispatch(loadTags(systemId, search, options, tagsCount))
}))(TagsModal);
