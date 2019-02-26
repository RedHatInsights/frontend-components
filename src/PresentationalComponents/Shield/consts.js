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
    High: {
        title: 'High',
        color: colorList.orange
    },
    Important: {
        title: 'Important',
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
    Low: {
        title: 'Low',
        color: colorList.default
    }
};

impactList.minimal = impactList.Medium;
impactList.maximal = impactList.Critical;
impactList.important = impactList.Important;
impactList.default = impactList.Low;
impactList.numerically = {
    1: 'Low',
    2: 'Medium',
    3: 'High',
    4: 'Critical'
};
