import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { toggleTagModal } from './redux/actions';
import { TagModal } from '@redhat-cloud-services/frontend-components';

const TagsModal = ({ showTagDialog, tags, activeSystemTag, tagCount, onToggleTagModal }) => {
    return (
        <TagModal
            width="auto"
            isOpen={ showTagDialog }
            toggleModal={() => onToggleTagModal()}
            columns={ [
                { title: 'Name' },
                { title: 'Value' },
                { title: 'Tag Source' }
            ] }
            systemName={ `${activeSystemTag.display_name} (${tagCount})` }
            rows={ tags.map(({ key, value, namespace }) => ([ key, value, namespace ])) }
        />
    );
};

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
