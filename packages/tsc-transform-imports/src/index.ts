// https://levelup.gitconnected.com/writing-typescript-custom-ast-transformer-part-2-5322c2b1660e
import * as ts from 'typescript';
import path from 'path';
import * as glob from 'glob';

const MODULES_ROOT = process.env.MODULES_ROOT;
const PACKAGES_ROOT = path.resolve(process.cwd(), 'packages');
const CORE_DIRECTORIES = [
  glob.sync(`${process.cwd()}/node_modules/@patternfly/react-core`),
  glob.sync(`${PACKAGES_ROOT}/*/node_modules/@patternfly/react-core`),
].flat();
const ICONS_DIRECTORIES = [
  glob.sync(`${process.cwd()}/node_modules/@patternfly/react-icons`),
  glob.sync(`${PACKAGES_ROOT}/*/node_modules/@patternfly/react-icons`),
].flat();
if (MODULES_ROOT) {
  // comma separated list of roots
  MODULES_ROOT.split(',').forEach((root) => {
    CORE_DIRECTORIES.push(...glob.sync(`${path.resolve(__dirname, root)}/node_modules/@patternfly/react-core`.replace(/\/\//, '/')));
    ICONS_DIRECTORIES.push(...glob.sync(`${path.resolve(__dirname, root)}/node_modules/@patternfly/react-icons`.replace(/\/\//, '/')));
  });
}

const PROPS_MATCH = /Props$/g;
const VARIANT_MATCH = /Variants?$/g;
const POSITION_MATCH = /Position$/g;
const SIZE_MATCH = /Sizes?$/g;

function filterNonStableLocation(location: string) {
  return !location.includes('next') && !location.includes('deprecated');
}

function getPossibleLocations(roots: string[], nameBinding: string) {
  let moduleLocation = roots
    .map((root) => glob.sync(`${root}/dist/esm/**/${nameBinding}.js`).filter(filterNonStableLocation))
    .find((r) => r.length > 0)?.[0];
  if (!moduleLocation && nameBinding.match(PROPS_MATCH)) {
    moduleLocation = roots
      .map((root) => glob.sync(`${root}/dist/esm/**/${nameBinding.replace(PROPS_MATCH, '')}.js`).filter(filterNonStableLocation))
      .find((r) => r.length > 0)?.[0];
  }

  if (!moduleLocation && nameBinding.match(VARIANT_MATCH)) {
    moduleLocation = roots
      .map((root) => glob.sync(`${root}/dist/esm/**/${nameBinding.replace(VARIANT_MATCH, '')}.js`).filter(filterNonStableLocation))
      .find((r) => r.length > 0)?.[0];
  }

  if (!moduleLocation && nameBinding.match(POSITION_MATCH)) {
    moduleLocation = roots
      .map((root) => glob.sync(`${root}/dist/esm/**/${nameBinding.replace(POSITION_MATCH, '')}.js`).filter(filterNonStableLocation))
      .find((r) => r.length > 0)?.[0];
  }

  if (!moduleLocation && nameBinding.match(SIZE_MATCH)) {
    moduleLocation = roots
      .map((root) => glob.sync(`${root}/dist/esm/**/${nameBinding.replace(SIZE_MATCH, '')}.js`).filter(filterNonStableLocation))
      .find((r) => r.length > 0)?.[0];
  }

  return moduleLocation;
}

function getModuleExplicitLocation(roots: string[], relativePath: string) {
  const defaultLocation = roots
    .map((root) => {
      return glob.sync(`${root}/dist/dynamic/**/${relativePath}`).filter(filterNonStableLocation);
    })
    .find((r) => r.length > 0)?.[0]
    ?.split('/dynamic/')
    .pop();
  if (defaultLocation) {
    return defaultLocation;
  }

  throw new Error(`Could not find source file for ${relativePath} in any of ${roots}!`);
}

// Prefilled with modules which name bindings do not match the import specifier
let COMPONENTS_CACHE: {
  [nameBinding: string]: string;
} = {};

if (CORE_DIRECTORIES.length > 0) {
  COMPONENTS_CACHE = {
    getResizeObserver: getModuleExplicitLocation(CORE_DIRECTORIES, 'helpers/resizeObserver'),
    useOUIAProps: getModuleExplicitLocation(CORE_DIRECTORIES, 'helpers/OUIA/ouia'),
    OUIAProps: getModuleExplicitLocation(CORE_DIRECTORIES, 'helpers/OUIA/ouia'),
    getDefaultOUIAId: getModuleExplicitLocation(CORE_DIRECTORIES, 'helpers/OUIA/ouia'),
    useOUIAId: getModuleExplicitLocation(CORE_DIRECTORIES, 'helpers/OUIA/ouia'),
    handleArrows: getModuleExplicitLocation(CORE_DIRECTORIES, 'helpers/KeyboardHandler'),
    setTabIndex: getModuleExplicitLocation(CORE_DIRECTORIES, 'helpers/KeyboardHandler'),
    IconComponentProps: getModuleExplicitLocation(CORE_DIRECTORIES, 'components/Icon'),
    TreeViewDataItem: getModuleExplicitLocation(CORE_DIRECTORIES, 'components/TreeView'),
    Popper: getModuleExplicitLocation(CORE_DIRECTORIES, 'helpers/Popper/Popper'),
    clipboardCopyFunc: getModuleExplicitLocation(CORE_DIRECTORIES, 'components/ClipboardCopy'),
    ToolbarChipGroup: getModuleExplicitLocation(CORE_DIRECTORIES, 'components/Toolbar'),
    DatePickerRef: getModuleExplicitLocation(CORE_DIRECTORIES, 'components/DatePicker'),
    ButtonType: getModuleExplicitLocation(CORE_DIRECTORIES, 'components/Button'),
    PaginationTitles: getModuleExplicitLocation(CORE_DIRECTORIES, 'components/Pagination'),
    ProgressMeasureLocation: getModuleExplicitLocation(CORE_DIRECTORIES, 'components/Progress'),
    isValidDate: getModuleExplicitLocation(CORE_DIRECTORIES, 'helpers/datetimeUtils'),
    ValidatedOptions: getModuleExplicitLocation(CORE_DIRECTORIES, 'helpers/constants'),
    capitalize: getModuleExplicitLocation(CORE_DIRECTORIES, 'helpers/util'),
    WizardFooterWrapper: getModuleExplicitLocation(CORE_DIRECTORIES, 'components/Wizard'),
    WizardFooter: getModuleExplicitLocation(CORE_DIRECTORIES, 'components/Wizard'),
    WizardContextProvider: getModuleExplicitLocation(CORE_DIRECTORIES, 'components/Wizard'),
    useWizardContext: getModuleExplicitLocation(CORE_DIRECTORIES, 'components/Wizard'),
    DataListWrapModifier: getModuleExplicitLocation(CORE_DIRECTORIES, 'components/DataList'),
    MenuToggleElement: getModuleExplicitLocation(CORE_DIRECTORIES, 'components/MenuToggle'),
  };
}

// Icons names that do not match the filename pattern
const ICONS_NAME_FIX: {
  [nameBinding: string]: string;
} = {
  AnsibeTowerIcon: 'ansibeTower-icon',
  ChartSpikeIcon: 'chartSpike-icon',
};

const ICONS_CACHE: {
  [iconImport: string]: string;
} = {};

function findComponentModule(nameBinding: string) {
  let modulePath = COMPONENTS_CACHE[nameBinding];
  if (modulePath) {
    return modulePath;
  }

  const sourceGlob = getPossibleLocations(CORE_DIRECTORIES, nameBinding);
  const sourceFile = sourceGlob ? glob.sync(sourceGlob) : [];
  if (sourceFile.length < 1) {
    throw new Error(
      `Unable to find source file for module ${nameBinding}! The module likely does not have unique file as is included within another file. Please add the entry into the COMPONENTS_CACHE in FEC repository`
    );
  }
  const moduleSource: string[] = sourceFile[0].split('esm').pop()?.split('/') || [];
  moduleSource?.pop();
  modulePath = moduleSource?.join('/').replace(/^\//, '');
  COMPONENTS_CACHE[nameBinding] = modulePath;
  return modulePath;
}

function camelToDash(str: string) {
  return str.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`).replace(/^-/, '');
}

function iconImportLiteral(icon: string) {
  if (ICONS_CACHE[icon]) {
    return ICONS_CACHE[icon];
  }

  const assumedImportName = camelToDash(icon);
  const fallbackName = ICONS_NAME_FIX[icon];

  if (ICONS_DIRECTORIES.map((root) => glob.sync(`${root}/**/${assumedImportName}.js`)).flat().length > 0) {
    ICONS_CACHE[icon] = `@patternfly/react-icons/dist/dynamic/icons/${assumedImportName}`;
  }

  if (!ICONS_CACHE[icon] && fallbackName && ICONS_DIRECTORIES.map((root) => glob.sync(`${root}/**/${fallbackName}.js`)).flat().length > 0) {
    ICONS_CACHE[icon] = `@patternfly/react-icons/dist/dynamic/icons/${fallbackName}`;
  }

  if (ICONS_CACHE[icon]) {
    return ICONS_CACHE[icon];
  } else {
    throw new Error(
      `Cannot find source files for the ${icon} icon. Expected filename ${assumedImportName}. It is possible the icon name does not match the filename pattern. You can look for the source file and add a new entry to the ICONS_NAME_FIX in the @redhat-cloud-services/tsc-transform-imports package.`
    );
  }
}

function createIconDynamicImports(nodeFactory: ts.NodeFactory, iconNames: string[]) {
  const imports = iconNames.map((icon) => {
    const importLiteral = iconImportLiteral(icon);

    return nodeFactory.createImportDeclaration(
      undefined,
      nodeFactory.createImportClause(false, nodeFactory.createIdentifier(icon), undefined),
      nodeFactory.createStringLiteral(importLiteral)
    );
  });
  return imports;
}

function createDynamicReactCoreImports(nodeFactory: ts.NodeFactory, node: ts.ImportDeclaration) {
  const importNames: (string | [string, string])[] = [];
  const importNodes: ts.ImportDeclaration[] = [];
  node.importClause;
  // get all named imports
  node.importClause?.namedBindings?.forEachChild((node) => {
    if (node.getChildCount() > 1) {
      importNames.push([node.getChildAt(0).getFullText().trim(), node.getFullText().trim()]);
    } else {
      importNames.push(node.getFullText().trim());
    }
  });
  const groups = importNames.reduce<{ [moduleGroup: string]: string[] }>((acc, nameBinding) => {
    if (typeof nameBinding === 'string') {
      const importPartial = findComponentModule(nameBinding).replace('/esm/', '/dynamic/');
      if (acc[importPartial]?.length > 0) {
        acc[importPartial].push(nameBinding);
      } else {
        acc[importPartial] = [nameBinding];
      }
    } else {
      const importPartial = findComponentModule(nameBinding[0]).replace('/esm/', '/dynamic/');
      if (acc[importPartial]?.length > 0) {
        acc[importPartial].push(nameBinding[1]);
      } else {
        acc[importPartial] = [nameBinding[1]];
      }
    }
    return acc;
  }, {});
  Object.entries(groups).forEach(([importPartial, nameBindings]) => {
    const importNode = nodeFactory.createImportDeclaration(
      node.modifiers,
      nodeFactory.createImportClause(
        false,
        undefined,
        nodeFactory.createNamedImports(
          nameBindings.map((nameBinding) => nodeFactory.createImportSpecifier(false, undefined, nodeFactory.createIdentifier(nameBinding)))
        )
      ),
      nodeFactory.createStringLiteral(`@patternfly/react-core/dist/dynamic/${importPartial}`),
      node.assertClause
    );
    importNodes.push(importNode);
  });
  return importNodes;
}

const DYNAMIC_OUTPUTS = [ts.ModuleKind.ES2015, ts.ModuleKind.ES2020, ts.ModuleKind.ES2022, ts.ModuleKind.ESNext];

const transformer: ts.TransformerFactory<ts.Node> = (context) => (rootNode) => {
  if (CORE_DIRECTORIES.length === 0 || ICONS_DIRECTORIES.length === 0) {
    return rootNode;
  }
  const opts = context.getCompilerOptions();
  // identify output eligible for dynamic imports
  const isDynamic = opts.module && DYNAMIC_OUTPUTS.includes(opts.module);

  function visitor(node: ts.Node): ts.VisitResult<ts.Node> {
    const { factory } = context;
    // handles relative imports import {foo} from '@patternfly/react-icons'
    // the regex has extra '$ condition
    if (
      isDynamic &&
      ts.isImportDeclaration(node) &&
      (/@patternfly\/react-(core|icons|tokens)'$/.test(node.moduleSpecifier.getText()) ||
        /@patternfly\/react-(core|icons|tokens)\/'$/.test(node.moduleSpecifier.getText()))
    ) {
      if (node.moduleSpecifier.getText().includes('react-icons')) {
        const importNames: string[] = [];
        // get all named imports
        node.importClause?.namedBindings?.forEachChild((node) => {
          importNames.push(node.getFullText().trim());
        });
        // create new icon import nodes
        return createIconDynamicImports(factory, importNames);
      }

      if (node.moduleSpecifier.getText().includes('react-core')) {
        return createDynamicReactCoreImports(factory, node);
      }

      return node;
    }

    // handle absolute icons import paths
    if (isDynamic && ts.isImportDeclaration(node) && /@patternfly\/react-(icons|tokens)/.test(node.moduleSpecifier.getText())) {
      if (ts.isImportDeclaration(node) && /@patternfly\/.*\/dist\/esm/.test(node.moduleSpecifier.getText())) {
        return factory.updateImportDeclaration(
          node,
          node.modifiers,
          node.importClause,
          factory.createStringLiteral(
            node.moduleSpecifier
              .getFullText()
              .replace(/"/g, '')
              .replace(/'/g, '')
              .replace(/dist\/esm/, 'dist/dynamic')
              .trim(),
            true
          ),
          undefined
        );
      }
    }
    return ts.visitEachChild(node, visitor, context);
  }
  return ts.visitNode(rootNode, visitor);
};

export default transformer;
