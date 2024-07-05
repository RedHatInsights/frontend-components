// https://levelup.gitconnected.com/writing-typescript-custom-ast-transformer-part-2-5322c2b1660e
import * as ts from 'typescript';
import * as fs from 'fs';
import * as glob from 'glob';
import { CORE_DIRECTORIES, ICONS_DIRECTORIES, findFirstGlob } from './directories';
import { guessComponentModule } from './old-core-imports';

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

function findModuleMap(roots: string[]): string | undefined {
  return findFirstGlob(roots, 'dist/dynamic-modules.json');
}

function loadModuleMap(roots: string[]): Map<string, string> | undefined {
  const path = findModuleMap(roots);
  if (path === undefined) return undefined;

  const loaded: unknown = JSON.parse(
    fs.readFileSync(path, {
      encoding: 'utf-8',
    })
  );

  if (typeof loaded !== 'object' || loaded === undefined || loaded === null) {
    throw new Error(`Expected dynamic-modules.json to contain an object, got ${loaded}`);
  }

  const map = new Map<string, string>();
  const dynamicPrefix = 'dist/dynamic/';

  for (const [key, value] of Object.entries(loaded)) {
    if (typeof value !== 'string') throw new Error(`Expected value of ${key} in dynamic-modules.json to be string, got ${value}`);
    map.set(key, value.startsWith(dynamicPrefix) ? value.substring(dynamicPrefix.length) : value);
  }

  return map;
}

const CORE_MODULE_MAP = loadModuleMap(CORE_DIRECTORIES);

function findComponentModule(nameBinding: string): string {
  // If dynamic-modules.json is present in this react-core version, use that.
  if (CORE_MODULE_MAP !== undefined) {
    const mapPath = CORE_MODULE_MAP.get(nameBinding);

    if (mapPath !== undefined) {
      const foundPath = findFirstGlob(CORE_DIRECTORIES, `dist/dynamic/${mapPath}`);

      // Fail loudly if a path in the map does not exist on disk.
      if (foundPath === undefined) {
        throw new Error(
          `@patternfly/react-core/dist/dynamic-modules.json contains path "${mapPath}" for "${nameBinding}", but no such file exists in ${CORE_DIRECTORIES}.`
        );
      }

      return mapPath;
    }
  }

  // If dynamic-modules.json is not present (or if the name to load is not in the map), guess at the module path.
  return guessComponentModule(nameBinding);
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
