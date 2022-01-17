import React, { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import PropTypes from 'prop-types';
import { toggleTagModal, fetchAllTags } from '../redux/actions';
import { TagModal } from '@redhat-cloud-services/frontend-components/TagModal';
import { cellWidth } from '@patternfly/react-table';
import debounce from 'lodash/debounce';
import flatten from 'lodash/flatten';

const TagsModal = ({ customFilters, filterTagsBy, onToggleModal, onApply }) => {
  const dispatch = useDispatch();
  const [filterBy, setFilterBy] = useState('');
  const [selected, setSelected] = useState([]);
  const [statePagination, setStatePagination] = useState({
    perPage: 10,
    page: 1,
  });

  const showTagDialog = useSelector(({ entities, entityDetails }) => (entities || entityDetails)?.showTagDialog);

  const pagination = useSelector(({ entities, entityDetails }) => {
    if (entities?.activeSystemTag || entityDetails?.entity) {
      return statePagination;
    }

    return entities?.allTagsPagination || statePagination;
  }, shallowEqual);

  const loaded = useSelector(({ entities, entityDetails }) => entities?.tagModalLoaded || entityDetails?.tagModalLoaded);

  const activeSystemTag = useSelector(({ entities, entityDetails }) => entities?.activeSystemTag || entityDetails?.entity);
  const tags = useSelector(({ entities, entityDetails }) => {
    const activeTags = entities?.activeSystemTag?.tags || entityDetails?.entity?.tags;
    if (activeTags) {
      return activeTags
        ?.filter((tag) => Object.values(tag).some((val) => val?.includes(filterBy)))
        .slice(statePagination?.perPage * (statePagination?.page - 1), statePagination?.perPage * statePagination?.page);
    }

    return entities?.allTags?.reduce((acc, { tags }) => [...acc, ...flatten(tags.map(({ tag }) => tag))], []);
  });
  const filters = useSelector(({ entities, entityDetails }) => (entities || entityDetails)?.activeFilters);
  const tagsCount = useSelector(({ entities, entityDetails }) => {
    const activeTags = (entities?.activeSystemTag?.tags || entityDetails?.entity?.tags)?.filter((tag) =>
      Object.values(tag).some((val) => val?.includes(filterBy))
    );
    return activeTags ? activeTags.length : entities?.allTagsTotal;
  });

  useEffect(() => {
    setFilterBy(filterTagsBy);
  }, [filterTagsBy]);

  const fetchTags = (pagination, filterBy) => {
    if (!activeSystemTag) {
      dispatch(fetchAllTags(filterBy, { ...customFilters, pagination, filters }));
    } else {
      setStatePagination(() => pagination);
    }
  };

  const debouncedFetch = useCallback(debounce(fetchTags, 800), [activeSystemTag]);

  return (
    <TagModal
      className="ins-c-inventory__tags-modal"
      tableProps={{
        canSelectAll: false,
      }}
      {...(loaded && {
        loaded,
        pagination: {
          ...pagination,
          count: tagsCount,
        },
        rows:
          tags?.map(({ key, value, namespace }) => ({
            id: `${namespace}/${key}=${value}`,
            selected: selected.find(({ id }) => id === `${namespace}/${key}=${value}`),
            cells: [key, value, namespace],
          })) || [],
      })}
      loaded={loaded}
      width="auto"
      isOpen={showTagDialog}
      toggleModal={() => {
        setSelected([]);
        setFilterBy('');
        onToggleModal();
        dispatch(toggleTagModal(false));
      }}
      filters={[
        {
          label: 'Tags filter',
          placeholder: 'Filter tags',
          value: 'tags-filter',
          filterValues: {
            value: filterBy,
            onChange: (_e, value) => {
              debouncedFetch(pagination, value);
              setFilterBy(value);
            },
          },
        },
      ]}
      onUpdateData={fetchTags}
      columns={[{ title: 'Name' }, { title: 'Value', transforms: [cellWidth(30)] }, { title: 'Tag source', transforms: [cellWidth(30)] }]}
      {...(!activeSystemTag && {
        onSelect: (selected) => setSelected(selected),
        selected,
        onApply: () => onApply && onApply(selected),
      })}
      title={activeSystemTag ? `${activeSystemTag.display_name} (${tagsCount})` : `All tags in inventory (${tagsCount})`}
    />
  );
};

TagsModal.propTypes = {
  onApply: PropTypes.func,
  onToggleModal: PropTypes.func,
  filterTagsBy: PropTypes.string,
  customFilters: PropTypes.shape({
    tags: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.string)]),
  }),
};

TagsModal.defaultProps = {
  filterTagsBy: '',
  onToggleModal: () => undefined,
};

export default TagsModal;
