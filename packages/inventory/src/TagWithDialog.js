import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { TagCount } from '@redhat-cloud-services/frontend-components/components/TagCount';
import { loadTags } from './redux/actions';

const TagWithDialog = ({ count, loadTags, systemId }) => (
    <span onClick={(e) => e.stopPropagation()} className="ins-c-inventory__list-tags">
        <TagCount count={count} onTagClick={ () => loadTags(systemId, count) } />
    </span>
);

TagWithDialog.propTypes = {
    count: PropTypes.number,
    loadTags: PropTypes.func,
    systemId: PropTypes.string
};

TagWithDialog.defaultProps = {
    loadTags: () => undefined
};

const dispatchToProps = (dispatch) => ({
    loadTags: (systemId, count) => {
        dispatch(loadTags(systemId, count));
    }
});

export default connect(() => ({}), dispatchToProps)(TagWithDialog);
