export const colorList = {
    default: 'var(--pf-global--Color--200)', // grey
    danger: 'var(--pf-global--danger-color--100)',
    warning: 'var(--pf-global--warning-color--100)',
    orange: '#ec7a08' // orange
};

/* I'm not shure that the list of impacts is ordered correctly by relevancy */
export const impactList = {
    Critical: {
        title: 'Critical',
        color: colorList.danger
    },
    4: {
        title: 'Critical',
        color: colorList.danger
    },
    High: {
        title: 'High',
        color: colorList.orange
    },
    Important: {
        title: 'Important',
        color: colorList.orange
    },
    3: {
        title: 'High',
        color: colorList.orange
    },
    Medium: {
        title: 'Medium',
        color: colorList.warning
    },
    Moderate: {
        title: 'Moderate',
        color: colorList.warning
    },
    2: {
        title: 'Medium',
        color: colorList.warning
    },
    Low: {
        title: 'Low',
        color: colorList.default
    },
    1: {
        title: 'Low',
        color: colorList.default
    }
};
