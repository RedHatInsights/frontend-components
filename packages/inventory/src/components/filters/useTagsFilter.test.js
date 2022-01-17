/* eslint-disable react/prop-types */
import React, { Fragment, useEffect } from 'react';
import { useTagsFilter } from './useTagsFilter';
import { mount } from 'enzyme';

const HookRender = ({ hookAccessor, hookNotify, loaded = true, additionalTagsCount = 0, onShowMoreClick, tagsLoaded }) => {
  const { tagsFilter, tagsChip, selectedTags, setSelectedTags, filterTagsBy, seFilterTagsBy } = useTagsFilter(
    [
      {
        name: 'something',
        tags: [
          {
            count: 10,
            tag: { key: 'test', value: 'something' },
          },
        ],
      },
    ],
    loaded,
    additionalTagsCount,
    onShowMoreClick
  );
  useEffect(() => {
    if (tagsFilter.filterValues.items && tagsFilter.filterValues.items.length !== 0) {
      tagsLoaded && tagsLoaded([tagsFilter, tagsChip, selectedTags, setSelectedTags, filterTagsBy, seFilterTagsBy]);
    }
  }, [tagsFilter]);
  useEffect(() => {
    if (tagsFilter.filterValues.groups && tagsFilter.filterValues.groups.length !== 0) {
      hookAccessor && hookAccessor([tagsFilter, tagsChip, selectedTags, setSelectedTags, filterTagsBy, seFilterTagsBy]);
    }
  }, [tagsFilter]);
  useEffect(() => {
    if (Object.keys(selectedTags).length !== 0) {
      hookNotify && hookNotify([tagsFilter, tagsChip, selectedTags, setSelectedTags, filterTagsBy, seFilterTagsBy]);
    }
  }, [selectedTags]);
  useEffect(() => {
    if (filterTagsBy.length !== 0) {
      hookNotify && hookNotify([tagsFilter, tagsChip, selectedTags, setSelectedTags, filterTagsBy, seFilterTagsBy]);
    }
  }, [filterTagsBy]);

  return <Fragment />;
};

describe('useTagsFilter', () => {
  it('should create filter', () => {
    const hookAccessor = ([filter]) => {
      expect(filter).toMatchObject({
        label: 'Tags',
        value: 'tags',
        type: 'group',
      });
      expect(filter.filterValues.selected).toMatchObject({});
      expect(filter.filterValues.filterBy).toBe('');
      expect(filter.filterValues.groups).toMatchObject([
        {
          items: [
            {
              meta: {
                count: 10,
                tag: { key: 'test', value: 'something' },
              },
              value: 'test=something',
            },
          ],
          label: 'something',
          type: 'checkbox',
          value: 'something',
        },
      ]);
    };

    mount(<HookRender hookAccessor={hookAccessor} />);
  });

  it('should create loading filter', () => {
    const hookAccessor = ([filter]) => {
      expect(filter).toMatchObject({
        label: 'Tags',
        value: 'tags',
        type: 'group',
      });
      expect(filter.filterValues.selected).toMatchObject({});
      expect(filter.filterValues.filterBy).toBe('');
      expect(filter.filterValues.items).toMatchObject([
        {
          isDisabled: true,
          className: 'ins-c-tagfilter__tail',
        },
      ]);
    };

    mount(<HookRender tagsLoaded={hookAccessor} loaded={false} />);
  });

  it('should create chip', () => {
    let called = false;
    const hookAccessor = ([, , , setValue]) => {
      if (!called) {
        setValue({
          something: {
            test: {
              group: {
                label: 'something',
              },
              isSelected: true,
              item: {
                meta: {
                  tag: {
                    value: 'test',
                    key: 'test',
                  },
                },
              },
            },
          },
        });
        called = true;
      }
    };

    const hookNotify = ([, chip, value]) => {
      expect(value.something.test.isSelected).toBe(true);
      expect(chip).toMatchObject([
        {
          type: 'tags',
          key: 'something',
          category: 'something',
        },
      ]);
      expect(chip[0].chips).toMatchObject([{ group: { label: 'something' }, key: 'test', name: 'test=test', tagKey: 'test', value: 'test' }]);
    };

    mount(<HookRender hookAccessor={hookAccessor} hookNotify={hookNotify} />);
  });

  it('should change filtered by', () => {
    let called = false;
    const hookAccessor = ([, , , , , seFilterTagsBy]) => {
      if (!called) {
        seFilterTagsBy('test');
      }

      called = true;
    };

    const hookNotify = ([, , , , filterBy]) => {
      expect(filterBy).toBe('test');
    };

    mount(<HookRender hookAccessor={hookAccessor} hookNotify={hookNotify} />);
  });

  it('should call show more', () => {
    const showMore = jest.fn();
    const hookAccessor = ([filter]) => {
      filter.filterValues.onShowMore();
    };

    mount(<HookRender hookAccessor={hookAccessor} onShowMoreClick={showMore} additionalTagsCount={10} />);
    expect(showMore).toHaveBeenCalled();
  });
});
