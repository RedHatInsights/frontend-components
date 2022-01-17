const sortFile = require('./sort-files');

function getComponentNav(path) {
  let fragments = path.split('/');
  const navName = fragments.pop().replace(/\.(js|tsx?$)/, '');
  const groupName = fragments.pop();
  return {
    navName,
    groupName,
  };
}

function assignComponentToNav(nav, { packageName, groupName, navName, title }) {
  if (!nav[packageName]) {
    nav[packageName] = {};
  }

  if (!nav[packageName][groupName]) {
    nav[packageName][groupName] = [];
  }

  nav[packageName][groupName].push(title ? { title, name: navName } : navName);
}

function generateComponentsNavigation(components) {
  const nav = {};
  Object.entries(components).forEach(([path, API]) => {
    const packageName = sortFile(path);
    const { navName, groupName } = getComponentNav(path);
    if (API.jsdoc) {
      API.items.forEach(({ name }) => {
        assignComponentToNav(nav, { packageName, navName: `${navName}-${name}`, groupName, title: name });
      });
    } else {
      assignComponentToNav(nav, { packageName, navName, groupName });
    }
  });
  return Object.entries(nav)
    .map(([key, groups]) => ({
      packageName: key,
      groups: Object.entries(groups)
        .map(([key, value]) => ({
          group: key,
          items: value.sort((a, b) => {
            const firsTitle = typeof a === 'object' ? a.title : a;
            const secondTitle = typeof b === 'object' ? b.title : b;
            return firsTitle.localeCompare(secondTitle);
          }),
        }))
        .sort((a, b) => a.group.localeCompare(b.group)),
    }))
    .sort((a, b) => a.packageName.localeCompare(b.packageName));
}

module.exports = generateComponentsNavigation;
