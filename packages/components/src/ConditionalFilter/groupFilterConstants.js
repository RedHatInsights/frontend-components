import groupTypes from './groupType';

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
        onClick: (event, treeViewItem, checked) => {
            const params = [
                event,
                calculateSelected(
                    groupType || item.type,
                    groupValue,
                    (groupType || item.type) === groupTypes.treeView
                        ? treeViewItem
                        : item.value,
                    checked),
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

export const convertTreeItem = (item) => {
    item.id = item.id || item.value;
    item.name = item.label || item.name;
    item.value = item.id;
    item.label = item.name;

    return item.children ? {
        ...item,
        children: item.children.map(child => convertTreeItem(child))
    } : item;
};

export const getGroupMenuItems = (groups, onChange, calculateSelected) => {
    const result = groups.map(({ value, label, id, type, items, ...group }) => {
        const converted = type === groupTypes.treeView ? items.map(item => convertTreeItem(item)) : items;
        return ({
            label,
            value,
            type,
            items: getMenuItems(converted, onChange, calculateSelected, type, value, label, id, group)
        });
    });
    return result.filter(({ noFilter, items = [] }) => !noFilter || items.length > 0);
};

export const calculateSelected = (selectedTags) => (type, groupKey, value, checked) => {
    const activeGroup = selectedTags?.[groupKey];

    let children = (type === groupTypes.treeView) && [ value ].reduce(function iter(r, a) {
        if (Array.isArray(a.children)) {
            return a.children.reduce(iter, r);
        }

        r.push(a);
        return r;
    }, []);

    const itemKeys = (type === groupTypes.treeView) ?
        (
            children.map((item) => item.id)
        ) : [ value ];

    if (activeGroup) {
        let result = selectedTags;
        itemKeys.map((itemKey) => {
            const activeGroup = result[groupKey];
            if (type !== groupTypes.radio && (activeGroup[itemKey] instanceof Object ? activeGroup[itemKey].isSelected : Boolean(activeGroup[itemKey]))) {
                result = {
                    ...result,
                    [groupKey]: {
                        ...(activeGroup || {}),
                        [itemKey]: (type === groupTypes.treeView) && checked
                    }
                };
            } else {
                result = {
                    ...result,
                    [groupKey]: {
                        ...(type !== groupTypes.radio ? activeGroup || {} : {}),
                        [itemKey]: true
                    }
                };
            }
        });
        return result;
    }

    return itemKeys.reduce((acc, curr) => ({
        ...acc,
        [groupKey]: {
            ...acc?.[groupKey],
            [curr]: true
        }
    }), selectedTags);
};

const areAllChildrenChecked = (dataItem, groupKey, stateSelected, selected) =>
    dataItem.children
        ? dataItem.children.every(child => areAllChildrenChecked(child, groupKey, stateSelected, selected))
        : isChecked(groupKey, dataItem.id, undefined, undefined, stateSelected, selected);

const areSomeChildrenChecked = (dataItem, groupKey, stateSelected, selected) =>
    dataItem.children
        ? dataItem.children.some(child => areSomeChildrenChecked(child, groupKey, stateSelected, selected))
        : isChecked(groupKey, dataItem.id, undefined, undefined, stateSelected, selected);

export const mapTree = (item, groupKey, stateSelected, selected) => {
    const hasCheck = areAllChildrenChecked(item, groupKey, stateSelected, selected);
    item.checkProps = { checked: false } ;

    if (hasCheck) {
        item.checkProps.checked = true;
    } else {
        const hasPartialCheck = areSomeChildrenChecked(item, groupKey, stateSelected, selected);
        if (hasPartialCheck) {
            item.checkProps = { checked: null };
        }
    }

    if (item.children) {
        return {
            ...item,
            children: item.children.map(child => mapTree(child, groupKey, stateSelected, selected))
        };
    }

    return item;
};

export const onTreeCheck = (e, treeViewItem, tree) => tree[0].onClick(e, treeViewItem, e?.target?.checked);
