export const stringToId = (string) => (
    string.split(' ').join('').toLowerCase()
);

export const getSortable = (property, rule) => {
    switch (property) {
        case 'rule':
            return rule.title;
        case 'policy':
            return rule.profiles[0].name;
        case 'severity':
            return rule.severity;
        case 'passed':
            return rule.compliant;
        case 'ansible':
            return rule.remediationAvailable;
        default:
            return rule.title;
    }
};

export const orderRuleArrayByProp = (property, objects, direction) => (
    objects.sort((a, b) => {
        if (direction === 'asc') {
            return String(getSortable(property, a)).localeCompare(String(getSortable(property, b)));
        } else {
            return -String(getSortable(property, a)).localeCompare(String(getSortable(property, b)));
        }
    })
);

export const orderByArray = (objectArray, orderProp, orderArray, direction) => (
    (direction !== 'asc' ? orderArray.reverse() : orderArray).flatMap((orderKey) => (
        objectArray.filter((item) => (item[orderProp] === orderKey))
    ))
);
