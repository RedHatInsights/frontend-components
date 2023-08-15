/**
 * @fileoverview Rule to disallow relative imports from @patternfly packages to enable "treeshaking" in module federation environment
 * @author Martin Marosi
 */
const glob = require('glob');
const path = require('path');
const PFPackages = ['@patternfly/react-core', '@patternfly/react-icons', '@patternfly/tokens'];

const PROPS_MATCH = /Props$/g;
const VARIANT_MATCH = /Variants?$/g;
const POSITION_MATCH = /Position$/g;

const ICONS_NAME_FIX = {
  AnsibeTowerIcon: 'ansibeTower-icon',
  ChartSpikeIcon: 'chartSpike-icon',
  CloudServerIcon: 'cloudServer-icon',
};

let CORE_CACHE = {};
let COMPONENTS_CACHE = {};

function findCoreComponent(name) {
  if (CORE_CACHE[name]) {
    return CORE_CACHE[name];
  }
  let source = glob
    .sync(path.resolve(process.cwd(), `node_modules/${PFPackages[0]}/dist/esm/**/${name}.js`))
    .filter((path) => !path.includes('deprecated'))?.[0];
  if (!source && name.match(PROPS_MATCH)) {
    source = glob
      .sync(path.resolve(process.cwd(), `node_modules/${PFPackages[0]}/dist/esm/**/${name.replace(PROPS_MATCH, '')}.js`))
      .filter((path) => !path.includes('deprecated'))?.[0];
  }
  if (!source && name.match(VARIANT_MATCH)) {
    source = glob
      .sync(path.resolve(process.cwd(), `node_modules/${PFPackages[0]}/dist/esm/**/${name.replace(VARIANT_MATCH, '')}.js`))
      .filter((path) => !path.includes('deprecated'))?.[0];
  }
  if (!source && name.match(POSITION_MATCH)) {
    source = glob
      .sync(path.resolve(process.cwd(), `node_modules/${PFPackages[0]}/dist/esm/**/${name.replace(POSITION_MATCH, '')}.js`))
      .filter((path) => !path.includes('deprecated'))?.[0];
  }
  if (!source) {
    return false;
  }
  let dynamicSource = source.split('node_modules/').pop().replace('/esm/', '/dynamic/').split('/');
  dynamicSource.pop();
  dynamicSource = dynamicSource.join('/');
  CORE_CACHE[name] = dynamicSource;
  return dynamicSource;
}

function camelToDash(str) {
  return str.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`).replace(/^-/, '');
}

function findIcon(name) {
  if (COMPONENTS_CACHE[name]) {
    return COMPONENTS_CACHE[name];
  }
  const nameSpecifier = ICONS_NAME_FIX[name] || camelToDash(name);
  return `@patternfly/react-icons/dist/dynamic/icons/${nameSpecifier}`;
}

CORE_CACHE = {
  ...CORE_CACHE,
  getResizeObserver: findCoreComponent('resizeObserver'),
  useOUIAProps: findCoreComponent('ouia'),
  OUIAProps: findCoreComponent('ouia'),
  getDefaultOUIAId: findCoreComponent('ouia'),
  useOUIAId: findCoreComponent('ouia'),
  handleArrows: findCoreComponent('KeyboardHandler'),
  setTabIndex: findCoreComponent('KeyboardHandler'),
  IconComponentProps: findCoreComponent('Icon'),
  TreeViewDataItem: findCoreComponent('TreeView'),
  Popper: findCoreComponent('Popper/Popper'),
};

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'forbid relative imports from PF packages',
      category: 'Possible build errors',
      recommended: true,
    },
    fixable: 'code',
    messages: {
      avoidRelativeImport:
        'Avoid using relative imports from {{ package }}. Use direct import path to {{ source }}. Module may be found at {{ hint }}.',
      avoidRelativeIconImport:
        'Avoid using relative imports from {{ package }}. Use direct import path to {{ source }}. Module may be found at {{ hint }}.',
      avoidImportingStyles: 'Avoid importing styles from {{ package }}. Styles are injected with components automatically.',
    },
  },
  create: function (context) {
    return {
      ImportDeclaration: function (codePath) {
        const importString = codePath.source.value;
        const pfImport = importString === PFPackages[0];
        const iconsImport = importString === PFPackages[1];
        if (PFPackages.includes(importString) && importString.match(/(css|scss|sass)/gim)) {
          context.report({
            node: codePath,
            messageId: 'avoidImportingStyles',
            data: {
              package: importString,
            },
            fix: function (fixer) {
              return fixer.remove(codePath.parent);
            },
          });
        }

        /**
         * Check if import is from FEC package and if it directly matches the package name which means its relative import
         */
        if (pfImport && PFPackages.includes(importString)) {
          const fullImport = context.getSourceCode(codePath.parent).text;
          /**
           * Check if the import is not full import statement
           */
          if (!fullImport.includes('from')) {
            return;
          }
          /**
           * Determine correct variable for direct import
           */

          let variables = context.getDeclaredVariables(codePath);
          let varName = 'Unknown';
          if (variables.length > 0) {
            varName = variables[0].name;
          }

          const newText = variables.map(function (data) {
            const importPartial = findCoreComponent(data.name);
            return `import { ${data.name} } from '${importPartial}'`;
          });
          context.report({
            node: codePath,
            messageId: 'avoidRelativeImport',
            data: {
              package: importString,
              source: varName,
              hint: newText.join('\n'),
            },
            fix: function (fixer) {
              return fixer.replaceText(codePath, newText.join('\n'));
            },
          });
        }

        /**
         * Check icons import
         */
        if (iconsImport) {
          const fullImport = context.getSourceCode(codePath.parent).text;
          /**
           * Check if the import is not full import statement
           */
          if (!fullImport.includes('from')) {
            return;
          }

          let variables = context.getDeclaredVariables(codePath);
          let varName = 'Unknown';
          if (variables.length > 0) {
            varName = variables[0].name;
          }

          const newText = variables.map(function (data) {
            const importPartial = findIcon(data.name);
            return `import ${data.name} from '${importPartial}'`;
          });

          context.report({
            node: codePath,
            messageId: 'avoidRelativeIconImport',
            data: {
              package: importString,
              source: varName,
              hint: newText.join('\n'),
            },
            fix: function (fixer) {
              return fixer.replaceText(codePath, newText.join('\n'));
            },
          });
        }
      },
    };
  },
};
