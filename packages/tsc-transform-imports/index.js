"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ts = __importStar(require("typescript"));
var fs = __importStar(require("fs"));
var glob = __importStar(require("glob"));
var directories_1 = require("./directories");
var guess_module_1 = __importDefault(require("./guess-module"));
var ICONS_NAME_FIX = {
    AnsibeTowerIcon: 'ansibeTower-icon',
    ChartSpikeIcon: 'chartSpike-icon',
};
var ICONS_CACHE = {};
function findModuleMap(roots) {
    return (0, directories_1.findFirstGlob)(roots, 'dist/dynamic-modules.json');
}
function loadModuleMap(roots) {
    var path = findModuleMap(roots);
    if (path === undefined)
        return undefined;
    var loaded = JSON.parse(fs.readFileSync(path, {
        encoding: 'utf-8',
    }));
    if (typeof loaded !== 'object' || loaded === undefined || loaded === null) {
        throw new Error("Expected dynamic-modules.json to contain an object, got ".concat(loaded));
    }
    var map = new Map();
    var dynamicPrefix = 'dist/dynamic/';
    for (var _i = 0, _a = Object.entries(loaded); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        if (typeof value !== 'string')
            throw new Error("Expected value of ".concat(key, " in dynamic-modules.json to be string, got ").concat(value));
        map.set(key, value.startsWith(dynamicPrefix) ? value.substring(dynamicPrefix.length) : value);
    }
    return map;
}
var CORE_MODULE_MAP = loadModuleMap(directories_1.CORE_DIRECTORIES);
var CORE_COMPONENT_CACHE = new Map();
function findComponentModuleUncached(nameBinding) {
    if (CORE_MODULE_MAP !== undefined) {
        var mapPath = CORE_MODULE_MAP.get(nameBinding);
        if (mapPath !== undefined) {
            var foundPath = (0, directories_1.findFirstGlob)(directories_1.CORE_DIRECTORIES, "dist/dynamic/".concat(mapPath));
            if (foundPath === undefined) {
                throw new Error("@patternfly/react-core/dist/dynamic-modules.json contains path \"".concat(mapPath, "\" for \"").concat(nameBinding, "\", but no such file exists in ").concat(directories_1.CORE_DIRECTORIES, "."));
            }
            return mapPath;
        }
    }
    return (0, guess_module_1.default)(nameBinding);
}
function findComponentModule(nameBinding) {
    var cached = CORE_COMPONENT_CACHE.get(nameBinding);
    if (cached !== undefined)
        return cached;
    var module = findComponentModuleUncached(nameBinding);
    CORE_COMPONENT_CACHE.set(nameBinding, module);
    return module;
}
function camelToDash(str) {
    return str.replace(/([A-Z])/g, function (g) { return "-".concat(g[0].toLowerCase()); }).replace(/^-/, '');
}
function iconImportLiteral(icon) {
    if (ICONS_CACHE[icon]) {
        return ICONS_CACHE[icon];
    }
    var assumedImportName = camelToDash(icon);
    var fallbackName = ICONS_NAME_FIX[icon];
    if (directories_1.ICONS_DIRECTORIES.map(function (root) { return glob.sync("".concat(root, "/**/").concat(assumedImportName, ".js")); }).flat().length > 0) {
        ICONS_CACHE[icon] = "@patternfly/react-icons/dist/dynamic/icons/".concat(assumedImportName);
    }
    if (!ICONS_CACHE[icon] && fallbackName && directories_1.ICONS_DIRECTORIES.map(function (root) { return glob.sync("".concat(root, "/**/").concat(fallbackName, ".js")); }).flat().length > 0) {
        ICONS_CACHE[icon] = "@patternfly/react-icons/dist/dynamic/icons/".concat(fallbackName);
    }
    if (ICONS_CACHE[icon]) {
        return ICONS_CACHE[icon];
    }
    else {
        throw new Error("Cannot find source files for the ".concat(icon, " icon. Expected filename ").concat(assumedImportName, ". It is possible the icon name does not match the filename pattern. You can look for the source file and add a new entry to the ICONS_NAME_FIX in the @redhat-cloud-services/tsc-transform-imports package."));
    }
}
function createIconDynamicImports(nodeFactory, iconNames) {
    var imports = iconNames.map(function (icon) {
        var importLiteral = iconImportLiteral(icon);
        return nodeFactory.createImportDeclaration(undefined, nodeFactory.createImportClause(false, nodeFactory.createIdentifier(icon), undefined), nodeFactory.createStringLiteral(importLiteral));
    });
    return imports;
}
function createDynamicReactCoreImports(nodeFactory, node) {
    var _a, _b;
    var importNames = [];
    var importNodes = [];
    node.importClause;
    (_b = (_a = node.importClause) === null || _a === void 0 ? void 0 : _a.namedBindings) === null || _b === void 0 ? void 0 : _b.forEachChild(function (node) {
        if (node.getChildCount() > 1) {
            importNames.push([node.getChildAt(0).getFullText().trim(), node.getFullText().trim()]);
        }
        else {
            importNames.push(node.getFullText().trim());
        }
    });
    var groups = importNames.reduce(function (acc, nameBinding) {
        var _a, _b;
        if (typeof nameBinding === 'string') {
            var importPartial = findComponentModule(nameBinding).replace('/esm/', '/dynamic/');
            if (((_a = acc[importPartial]) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                acc[importPartial].push(nameBinding);
            }
            else {
                acc[importPartial] = [nameBinding];
            }
        }
        else {
            var importPartial = findComponentModule(nameBinding[0]).replace('/esm/', '/dynamic/');
            if (((_b = acc[importPartial]) === null || _b === void 0 ? void 0 : _b.length) > 0) {
                acc[importPartial].push(nameBinding[1]);
            }
            else {
                acc[importPartial] = [nameBinding[1]];
            }
        }
        return acc;
    }, {});
    Object.entries(groups).forEach(function (_a) {
        var importPartial = _a[0], nameBindings = _a[1];
        var importNode = nodeFactory.createImportDeclaration(node.modifiers, nodeFactory.createImportClause(false, undefined, nodeFactory.createNamedImports(nameBindings.map(function (nameBinding) { return nodeFactory.createImportSpecifier(false, undefined, nodeFactory.createIdentifier(nameBinding)); }))), nodeFactory.createStringLiteral("@patternfly/react-core/dist/dynamic/".concat(importPartial)), node.assertClause);
        importNodes.push(importNode);
    });
    return importNodes;
}
var DYNAMIC_OUTPUTS = [ts.ModuleKind.ES2015, ts.ModuleKind.ES2020, ts.ModuleKind.ES2022, ts.ModuleKind.ESNext];
var transformer = function (context) { return function (rootNode) {
    if (directories_1.CORE_DIRECTORIES.length === 0 || directories_1.ICONS_DIRECTORIES.length === 0) {
        return rootNode;
    }
    var opts = context.getCompilerOptions();
    var isDynamic = opts.module && DYNAMIC_OUTPUTS.includes(opts.module);
    function visitor(node) {
        var _a, _b;
        var factory = context.factory;
        if (isDynamic &&
            ts.isImportDeclaration(node) &&
            (/@patternfly\/react-(core|icons|tokens)'$/.test(node.moduleSpecifier.getText()) ||
                /@patternfly\/react-(core|icons|tokens)\/'$/.test(node.moduleSpecifier.getText()))) {
            if (node.moduleSpecifier.getText().includes('react-icons')) {
                var importNames_1 = [];
                (_b = (_a = node.importClause) === null || _a === void 0 ? void 0 : _a.namedBindings) === null || _b === void 0 ? void 0 : _b.forEachChild(function (node) {
                    importNames_1.push(node.getFullText().trim());
                });
                return createIconDynamicImports(factory, importNames_1);
            }
            if (node.moduleSpecifier.getText().includes('react-core')) {
                return createDynamicReactCoreImports(factory, node);
            }
            return node;
        }
        if (isDynamic && ts.isImportDeclaration(node) && /@patternfly\/react-(icons|tokens)/.test(node.moduleSpecifier.getText())) {
            if (ts.isImportDeclaration(node) && /@patternfly\/.*\/dist\/esm/.test(node.moduleSpecifier.getText())) {
                var moduleSpecifier = node.moduleSpecifier
                    .getFullText()
                    .replace(/"/g, '')
                    .replace(/'/g, '');
                if (!node.moduleSpecifier.getText().includes('react-tokens')) {
                    moduleSpecifier.replace(/dist\/esm/, 'dist/dynamic');
                }
                return factory.updateImportDeclaration(node, node.modifiers, node.importClause, factory.createStringLiteral(moduleSpecifier.trim(), true), undefined);
            }
        }
        return ts.visitEachChild(node, visitor, context);
    }
    return ts.visitNode(rootNode, visitor);
}; };
exports.default = transformer;
//# sourceMappingURL=index.js.map