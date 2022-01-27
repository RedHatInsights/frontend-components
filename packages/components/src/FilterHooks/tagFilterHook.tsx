import React, { useState, useEffect } from 'react';
import { constructGroups, mapGroups } from './constants';
import { Spinner } from '@patternfly/react-core';
import './tagFilterHook.scss';
import { AllTag, GroupItem, GroupValue } from './constants';

export const tagsFilterState = { tagsFilter: {} };
export const TAGS_FILTER = 'TAGS_FILTER';
/**TODO: figure our full payload type */
export const tagsFilterReducer = (_state: any, { type, payload }: { type: typeof TAGS_FILTER | string; payload: any }) => ({
  ...(type === TAGS_FILTER && {
    tagsFilter: payload,
  }),
});

type UseTagsFilter = (
  allTags?: AllTag[],
  loaded?: boolean,
  additionalTagsCount?: number,
  /** TODO: figure out full type for the callback */
  onShowMoreClick?: (...args: any[]) => void,
  reducer?: [Record<string, { [key: string]: GroupValue }>, (...args: any[]) => any] | [Record<string, { [key: string]: GroupValue }>],
  itemText?: string,
  showMoreTitle?: React.ReactNode
) => void;

export const useTagsFilter: UseTagsFilter = (
  allTags = [],
  loaded = false,
  additionalTagsCount = 0,
  onShowMoreClick,
  [globalState, dispatch] = [tagsFilterState],
  itemText = 'item',
  showMoreTitle
) => {
  const [state, setState] = useState<{
    allTags: AllTag[];
    loaded: boolean;
    additionalTagsCount: number;
  }>({
    allTags: [],
    loaded: false,
    additionalTagsCount: 0,
  });
  useEffect(() => {
    setState(() => ({
      allTags,
      loaded,
      additionalTagsCount,
    }));
  }, [loaded]);
  const [selectedStateTags, setStateValue] = useState({});
  const selectedTags: { [key: string]: GroupValue } = dispatch ? globalState.tagsFilter : selectedStateTags;
  const setValue = dispatch ? (newValue: unknown) => dispatch({ type: TAGS_FILTER, payload: newValue }) : setStateValue;

  const [filterTagsBy, seFilterTagsBy] = useState('');
  const filter = {
    className: 'ins-c-tagfilter',
    onFilter: (value: string) => seFilterTagsBy(value),
    filterBy: filterTagsBy,
    onChange: (
      _e: any,
      newSelection: { [key: string]: GroupValue },
      group: Record<string, unknown>,
      item: GroupItem,
      groupKey: string,
      itemKey: string
    ) => {
      if (item.meta) {
        const isSelected = !!newSelection[groupKey][itemKey];
        newSelection[groupKey][itemKey] = {
          isSelected,
          group,
          item,
        };
        setValue(newSelection);
      }
    },
    selected: selectedTags,
    ...(additionalTagsCount && {
      onShowMore: (...props: any[]) => onShowMoreClick && onShowMoreClick(...props),
      showMoreTitle: showMoreTitle || `${state.additionalTagsCount} more tags available`,
    }),
    ...(loaded && allTags.length > 0
      ? {
          groups: [...constructGroups(allTags, itemText)],
        }
      : {
          value: '',
          items: [
            {
              value: '',
              label: !state.loaded ? (
                <span key="no-tags-tooltip">
                  {' '}
                  <Spinner size="md" />{' '}
                </span>
              ) : (
                <div className="ins-c-tagfilter__no-tags"> No tags available </div>
              ),
              isDisabled: true,
              className: 'ins-c-tagfilter__tail',
            },
          ],
        }),
  };
  return {
    filter,
    chips: mapGroups(selectedTags, 'chips'),
    selectedTags,
    setValue,
    filterTagsBy,
    seFilterTagsBy,
  };
};
