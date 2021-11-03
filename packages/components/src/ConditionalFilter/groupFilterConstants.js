import groupType from './groupType';

export const isChecked = (groupValue, itemValue, id, tagValue, stateSelected, propSelected) => {
    const selected = {
        ...propSelected,
        ...stateSelected
    };

    if (typeof selected[groupValue] === 'undefined') {
        return false;
    }

    if (selected[groupValue][itemValue] instanceof Object) {
        if (selected[groupValue][itemValue].isSelected) {
            if (selected[groupValue][itemValue]?.item?.id) {
                return id === selected[groupValue][itemValue]?.item?.id;
            } else if (selected[groupValue][itemValue]?.item?.tagValue) {
                return tagValue === selected[groupValue][itemValue]?.item?.tagValue;
            }
        }

        return selected[groupValue][itemValue].isSelected;
    }

    return Boolean(selected[groupValue][itemValue]);
};

export const getMenuItems = (items, onChange, calculateSelected, groupType, groupValue = '', groupLabel, groupId, group) => {
    const result = items?.map((item, index) => ({
        ...item,
        key: item.id || item.value || index,
        value: String(item.value || item.id || index),
        onClick: (event) => {
            const params = [
                event,
                calculateSelected(groupType || item.type, groupValue, item.value),
                {
                    value: groupValue,
                    label: groupLabel || item.label,
                    id: groupId || item.id,
                    type: groupType || item.type,
                    items,
                    ...group || item
                },
                item,
                groupValue,
                item.value
            ];
            onChange(...params);
            item?.onClick?.(...params);
        }
    })) || [];

    return result.filter(({ noFilter }) => !noFilter);
};

export const getGroupMenuItems = (groups, onChange, calculateSelected) => {
    const result = groups.map(({ value, label, id, type, items, ...group }) => ({
        label,
        value,
        type,
        items: getMenuItems(items, onChange, calculateSelected, type, value, label, id, group)
    }));
    return result.filter(({ noFilter, items = [] }) => !noFilter || items.length > 0);
};

export const calculateSelected = (selectedTags) => (type, groupKey, itemKey) => {
    const activeGroup = selectedTags?.[groupKey];
    if (activeGroup) {
        if (type !== groupType.radio && (activeGroup[itemKey] instanceof Object ? activeGroup[itemKey].isSelected : Boolean(activeGroup[itemKey]))) {
            return {
                ...selectedTags,
                [groupKey]: {
                    ...(activeGroup || {}),
                    [itemKey]: false
                }
            };
        }

        return {
            ...selectedTags,
            [groupKey]: {
                ...(type !== groupType.radio ? activeGroup || {} : {}),
                [itemKey]: true
            }
        };
    }

    return {
        ...selectedTags,
        [groupKey]: {
            [itemKey]: true
        }
    };
};
