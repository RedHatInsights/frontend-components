import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { TagCount } from '@redhat-cloud-services/frontend-components/TagCount';
import { loadTags, toggleTagModal } from '../redux/actions';

const TagWithDialog = ({ count, loadTags, systemId }) => (
  <span onClick={(e) => e.stopPropagation()} className="ins-c-inventory__list-tags" data-ouia-component-id={`${systemId}-tag-button`}>
    <TagCount count={count} onTagClick={() => loadTags(systemId, count)} />
  </span>
);

TagWithDialog.propTypes = {
  count: PropTypes.number,
  loadTags: PropTypes.func,
  systemId: PropTypes.string,
};

const dispatchToProps = (dispatch) => ({
  loadTags: (systemId, count) => {
    if (systemId) {
      dispatch(toggleTagModal(true));
      dispatch(loadTags(systemId, undefined, undefined, count));
    }
  },
});

export default connect(() => ({}), dispatchToProps)(TagWithDialog);
