const sortFile = require('./sort-files');

function getComponentNav(path) {
    let fragments = path.split('/');
    const navName = fragments.pop().replace('.js', '');
    const groupName = fragments.pop();
    return {
        navName, groupName
    };
}

function assignComponentToNav(nav, { packageName, groupName, navName }) {
    if (!nav[packageName]) {
        nav[packageName] = {};
    }

    if (!nav[packageName][groupName]) {
        nav[packageName][groupName] = [];
    }

    nav[packageName][groupName].push(navName);
}

function generateComponentsNavigation(components) {
    const nav = {};
    Object.keys(components).forEach(path => {
        const packageName = sortFile(path);
        const { navName, groupName } = getComponentNav(path);
        assignComponentToNav(nav, { packageName, navName, groupName });
    });
    return Object.entries(nav).map(([ key, groups ]) => ({
        packageName: key,
        groups: Object.entries(groups).map(([ key, value ]) => ({
            group: key,
            items: value.sort((a, b) => a.localeCompare(b))
        })).sort((a, b) => a.group.localeCompare(b.group))
    })).sort((a, b) => a.packageName.localeCompare(b.packageName));
}

module.exports = generateComponentsNavigation;
