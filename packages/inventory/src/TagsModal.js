import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { toggleTagModal } from './redux/actions';
import { TagModal, Skeleton, SkeletonSize } from '@redhat-cloud-services/frontend-components';

const TagsModal = ({ showTagDialog, tagsLoaded, tags, activeSystemTag, tagCount, onToggleTagModal }) => {
    return (
        <TagModal
            width="auto"
            isOpen={ showTagDialog }
            toggleModal={() => onToggleTagModal()}
            systemName={ `${activeSystemTag.display_name} (${tagCount})` }
            rows={
                tagsLoaded ?
                    tags.map(({ tagName, tagValue }) => ([ tagName, tagValue ])) :
                    [ ...Array(tagCount) ].map(() => ([
                        { title: <Skeleton size={ SkeletonSize.md }>&nbsp;</Skeleton> },
                        { title: <Skeleton size={SkeletonSize.md}>&nbsp;</Skeleton> }
                    ]))
            }
        />
    );
};

TagsModal.propTypes = {
    showTagDialog: PropTypes.bool,
    tagsLoaded: PropTypes.bool,
    tags: PropTypes.arrayOf(PropTypes.shape({
        tagName: PropTypes.node,
        tagValue: PropTypes.node
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
    const { showTagDialog, tagsLoaded, tags, activeSystemTag, tagCount } = entities || entityDetails || {};
    return ({
        showTagDialog,
        tagsLoaded,
        tags,
        activeSystemTag,
        tagCount
    });
}, (dispatch) => ({
    onToggleTagModal: () => dispatch(toggleTagModal(false))
}))(TagsModal);
