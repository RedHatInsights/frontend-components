const relativeTimeTable = [
    { rightBound: 1000 * 60 * 60 * 24 * 365, description: date => `${Math.round(date / (1000 * 60 * 60 * 24 * 30))} months ago` },
    { rightBound: 1000 * 60 * 60 * 24 * 30, description: date => `${Math.round(date / (1000 * 60 * 60 * 24))} days ago` },
    { rightBound: 1000 * 60 * 60 * 24 * 2, description: _date => '1 day ago' },
    { rightBound: 1000 * 60 * 60 * 24, description: date => `${Math.round(date / (1000 * 60 * 60))} hours ago` },
    { rightBound: 1000 * 60 * 60, description: date => `${Math.round(date / (1000 * 60))} minutes ago` },
    { rightBound: 1000 * 60, description: (_date) => 'Just now' }
];

const exact = (value) => value.toUTCString().split(',')[1].slice(0, -4).trim();

export const dateStringByType = (type) => ({
    exact: date => exact(date) + ' UTC',
    onlyDate: date => exact(date).slice(0, -9),
    relative: date => relativeTimeTable.reduce((acc, i) => (i.rightBound > Date.now() - date ? i.description(Date.now() - date) : acc), exact(date)),
    invalid: _value => 'Invalid Date'
})[type];
