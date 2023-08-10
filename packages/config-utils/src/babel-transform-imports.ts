import * as glob from 'glob';
const defaultRoot = process.cwd();

const PROPS_MATCH = /Props$/g;
const VARIANT_MATCH = /Variants?$/g;
const POSITION_MATCH = /Position$/g;

const iconMapper: { [iconName: string]: string } = {
  AnsibeTowerIcon: 'ansibeTower-icon',
  ChartSpikeIcon: 'chartSpike-icon',
  CloudServerIcon: 'cloudServer-icon',
};

const ICONS_CACHE: { [iconName: string]: string } = {};

const COMPONENTS_CACHE: { [importName: string]: string } = {};

function findIconInRoots(roots: string[], icon: string) {
  const result = ICONS_CACHE[icon];
  if (result) {
    return result;
  }

  const nameSpecifier = icon.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`).replace(/^-/, '');

  const location = roots
    .map((root) => {
      return glob.sync(`${root}/node_modules/@patternfly/react-icons/dist/esm/**/${iconMapper[icon] || nameSpecifier}.js`);
    })
    .flat()?.[0];
  if (!location) {
    throw new Error(
      `Cannot find source files for the ${icon} icon. Expected filename ${nameSpecifier}. It is possible the icon name does not match the filename pattern. You can look for the source file and add a new entry to the "iconMapper" object in your babel.config.js.`
    );
  }

  return location.split('node_modules/').pop()?.replace(/\.js$/, '').replace('/esm/', '/dynamic/');
}

function findPfRoots(roots: string[], importName: string) {
  if (COMPONENTS_CACHE[importName]) {
    return COMPONENTS_CACHE[importName];
  }

  const importTemplate = `@patternfly/react-core/dist/esm/**/${importName}.js`;
  let componentSource: string | undefined = roots
    .map((root) => {
      return glob.sync(`${root}/node_modules/${importTemplate}`);
    })
    .flat()?.[0];

  if (!componentSource && importName.match(PROPS_MATCH)) {
    componentSource = roots
      .map((root) => {
        return glob.sync(`${root}/node_modules/${importTemplate.replace(/\.js$/, '').replace(PROPS_MATCH, '')}.js`);
      })
      .flat()?.[0];
  }

  if (!componentSource && importName.match(VARIANT_MATCH)) {
    componentSource = roots
      .map((root) => {
        return glob.sync(`${root}/node_modules/${importTemplate.replace(/\.js$/, '').replace(VARIANT_MATCH, '')}.js`);
      })
      .flat()?.[0];
  }

  if (!componentSource && importName.match(POSITION_MATCH)) {
    componentSource = roots
      .map((root) => {
        return glob.sync(`${root}/node_modules/${importTemplate.replace(/\.js$/, '').replace(POSITION_MATCH, '')}.js`);
      })
      .flat()?.[0];
  }

  if (!componentSource) {
    throw new Error(
      `Unable to find source file for ${importName}! Please find a source file for the component and add it to "moduleOverrides" argument of the createPfReactTransform babel plugin.`
    );
  }

  componentSource = componentSource.split('/esm/').pop();
  const componentFragments = componentSource!.split('/');
  componentFragments.pop();
  componentSource = `@patternfly/react-core/dist/dynamic/${componentFragments.join('/')}`;
  COMPONENTS_CACHE[importName] = componentSource;
  return componentSource;
}

const MISMATCHED_CORE_MODULES = {
  getResizeObserver: 'helpers/resizeObserver',
  useOUIAProps: 'helpers/OUIA/ouia',
  OUIAProps: 'helpers/OUIA/ouia',
  getDefaultOUIAId: 'helpers/OUIA/ouia',
  useOUIAId: 'helpers/OUIA/ouia',
  handleArrows: 'helpers/KeyboardHandler',
  setTabIndex: 'helpers/KeyboardHandler',
  IconComponentProps: 'components/Icon',
  TreeViewDataItem: 'components/TreeView',
  clipboardCopyFunc: 'components/ClipboardCopy',
};

function populateCoreCache(roots: string[], moduleOverrides: { [importName: string]: string }) {
  if (Object.values(COMPONENTS_CACHE).length === 0) {
    Object.entries({ ...MISMATCHED_CORE_MODULES, ...moduleOverrides }).forEach(([importName, pathPartial]) => {
      const expectedPath = `@patternfly/react-core/dist/dynamic/${pathPartial}`;
      const exists = roots.map((root) => glob.sync(`${root}/node_modules/${expectedPath}`.replace(/\/\//, '/'))).flat().length > 0;
      if (!exists) {
        throw new Error(
          `No module found at ${expectedPath} while trying to resolve module overrides! Please verify that ${pathPartial} matches the desired ${importName} component source file path.`
        );
      }

      COMPONENTS_CACHE[importName] = expectedPath;
    });
  }
}

const createPfReactTransform = (roots = [], moduleOverrides: { [importName: string]: string } = {}) => {
  const internalRoots = [defaultRoot, ...roots];
  populateCoreCache(internalRoots, moduleOverrides);
  return [
    'transform-imports',
    {
      '@patternfly/react-core': {
        transform: (importName: string) => findPfRoots(internalRoots, importName),
        preventFullImport: false,
        skipDefaultConversion: true,
      },
      '@patternfly/react-icons': {
        transform: (importName: string) => findIconInRoots(internalRoots, importName),
        preventFullImport: true,
      },
    },
  ];
};

export default createPfReactTransform;
module.exports = createPfReactTransform;
