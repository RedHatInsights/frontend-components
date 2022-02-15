import { conditionalFilterType } from '@redhat-cloud-services/frontend-components/ConditionalFilter';
import { defaultOnChange, stringToId, configItemItemByLabel, itemForValueInGroups, itemForLabelInGroups } from './helpers';

const textType = {
  // Creates the filterValues prop for the filterConfig passed to the toolbar/table provided the current value/state
  filterValues: ({ label }, handler, value) => ({
    value,
    ...defaultOnChange(handler, stringToId(label)),
  }),
  // Returns (all/a) filter chip for a given filter active value(s)
  filterChips: (configItem, value) => ({
    category: configItem.label,
    chips: [{ name: value[0] }],
  }),
  // Returns "select" arguments for the selection manager from a selected value
  // The returning of selectedValue/selectedValues is inconsistent.
  toSelectValue: (configItem, selectedValue) => [selectedValue.length === 0 ? undefined : [selectedValue], stringToId(configItem.label), true],
  // Returns "deselect" arguments from a filter chip
  toDeselectValue: (configItem, chip) => [chip.chips[0].name, stringToId(configItem.label)],
};

const checkboxType = {
  filterValues: ({ items, label }, handler, value) => ({
    items,
    value,
    ...defaultOnChange(handler, stringToId(label)),
  }),
  filterChips: (configItem, value) => ({
    category: configItem.label,
    chips: value.map((chipValue) => ({
      name: configItem.items.find((item) => item.value === chipValue).label,
    })),
  }),
  toSelectValue: (configItem, _, selectedValue) => [selectedValue, stringToId(configItem.label)],
  toDeselectValue: (configItem, chip) => [configItemItemByLabel(configItem, chip.chips[0].name).value, stringToId(configItem.label)],
};

const radioType = {
  filterValues: ({ items, label }, handler, value) => ({
    items,
    value: value?.[0],
    ...defaultOnChange(handler, stringToId(label)),
  }),
  filterChips: (configItem, value) => ({
    category: configItem.label,
    chips: [{ name: configItem.items.find((item) => item.value === value[0]).label }],
  }),
  // The radio filter returns the selectedValues as selectedValue and the other way around
  toSelectValue: (configItem, selectedValue) => [[selectedValue], stringToId(configItem.label), true],
  toDeselectValue: (configItem, chip) => [configItemItemByLabel(configItem, chip.chips[0].name).value, stringToId(configItem.label)],
};

const groupType = {
  filterValues: ({ items, label }, handler, value) => ({
    selected: value,
    groups: items?.map((item) => ({
      ...item,
      type: 'checkbox',
      items: item.items?.map((subItem) => ({
        ...subItem,
        type: 'checkbox',
      })),
    })),
    ...defaultOnChange(handler, stringToId(label)),
  }),
  filterChips: (configItem, value) => ({
    category: configItem.label,
    chips: Object.entries(value).flatMap((groupItem) =>
      Object.keys(groupItem[1]).map((itemValue) => ({ name: itemForValueInGroups(configItem, itemValue).label }))
    ),
  }),
  toSelectValue: (configItem, selectedValues) => [selectedValues, stringToId(configItem.label), true],
  toDeselectValue: (configItem, chip, activeFilters) => {
    const filter = stringToId(configItem.label);
    const activeValues = activeFilters[filter];
    const item = itemForLabelInGroups(configItem, chip.chips[0].name);
    if (item.parent?.value) {
      delete activeValues[item.parent.value][item.value];
    } else {
      delete activeValues[item.value][item.value];
    }

    return [activeValues, filter, true];
  },
};

export default (type) =>
  ({
    [conditionalFilterType.text]: textType,
    [conditionalFilterType.checkbox]: checkboxType,
    [conditionalFilterType.radio]: radioType,
    [conditionalFilterType.group]: groupType,
  }[type]);
