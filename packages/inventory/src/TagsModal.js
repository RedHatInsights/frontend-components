import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { toggleTagModal } from './redux/actions';
import { TagModal } from '@redhat-cloud-services/frontend-components';

class TagsModal extends React.Component {
    state = {
        filterTagsBy: '',
        selected: []
    }
    render() {
        const { showTagDialog, tags, activeSystemTag, tagCount, onToggleTagModal } = this.props;
        const { filterTagsBy, selected } = this.state;
        return (
            <TagModal
                width="auto"
                isOpen={ showTagDialog }
                toggleModal={() => onToggleTagModal()}
                pagination={{
                    count: tagCount
                }}
                filters={[
                    {
                        label: 'Tags filter',
                        placeholder: 'Filter tags',
                        value: 'tags-filter',
                        filterValues: {
                            value: filterTagsBy,
                            onChange: (_e, value) => this.setState({ filterTagsBy: value })
                        }
                    }
                ]}
                onUpdateData={ console.log }
                columns={ [
                    { title: 'Name' },
                    { title: 'Value' },
                    { title: 'Tag Sources' }
                ] }
                onSelect={(selected) => this.setState({ selected })}
                selected={selected}
                systemName={ `${activeSystemTag.display_name} (${tagCount})` }
                rows={ tags.map(({ key, value, namespace }) => ({
                    id: `${namespace}/${key}=${value}`,
                    selected: selected.find(({ id }) => id === `${namespace}/${key}=${value}`),
                    cells: [ key, value, namespace ]
                })) }
            />
        );
    }
}

TagsModal.propTypes = {
    showTagDialog: PropTypes.bool,
    tags: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.node,
        namespace: PropTypes.node
    })),
    tagCount: PropTypes.number,
    activeSystemTag: PropTypes.shape({
        id: PropTypes.string,
        // eslint-disable-next-line camelcase
        display_name: PropTypes.string
    }),
    onToggleTagModal: PropTypes.func
};

TagsModal.defaultProps = {
    showTagDialog: false,
    tagCount: 0,
    tags: [],
    activeSystemTag: {},
    onToggleTagModal: () => undefined
};

export default connect(({ entities, entityDetails }) => {
    const { showTagDialog, activeSystemTag = { tags: [] } } = entities || entityDetails || {};
    return ({
        showTagDialog,
        tags: activeSystemTag.tags,
        activeSystemTag,
        tagCount: activeSystemTag.tags && activeSystemTag.tags.length
    });
}, (dispatch) => ({
    onToggleTagModal: () => dispatch(toggleTagModal(false))
}))(TagsModal);
