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
Object.defineProperty(exports, "__esModule", { value: true });
var glob = __importStar(require("glob"));
var directories_1 = require("./directories");
var PROPS_MATCH = /Props$/g;
var VARIANT_MATCH = /Variants?$/g;
var POSITION_MATCH = /Position$/g;
var SIZE_MATCH = /Sizes?$/g;
function filterNonStableLocation(location) {
    return !location.includes('next') && !location.includes('deprecated');
}
function getPossibleLocations(roots, nameBinding) {
    var moduleLocation = (0, directories_1.findFirstGlob)(roots, "dist/esm/**/".concat(nameBinding, ".js"), filterNonStableLocation);
    if (!moduleLocation && nameBinding.match(PROPS_MATCH)) {
        moduleLocation = (0, directories_1.findFirstGlob)(roots, "dist/esm/**/".concat(nameBinding.replace(PROPS_MATCH, ''), ".js"), filterNonStableLocation);
    }
    if (!moduleLocation && nameBinding.match(VARIANT_MATCH)) {
        moduleLocation = (0, directories_1.findFirstGlob)(roots, "dist/esm/**/".concat(nameBinding.replace(VARIANT_MATCH, ''), ".js"), filterNonStableLocation);
    }
    if (!moduleLocation && nameBinding.match(POSITION_MATCH)) {
        moduleLocation = (0, directories_1.findFirstGlob)(roots, "dist/esm/**/".concat(nameBinding.replace(POSITION_MATCH, ''), ".js"), filterNonStableLocation);
    }
    if (!moduleLocation && nameBinding.match(SIZE_MATCH)) {
        moduleLocation = (0, directories_1.findFirstGlob)(roots, "dist/esm/**/".concat(nameBinding.replace(SIZE_MATCH, ''), ".js"), filterNonStableLocation);
    }
    return moduleLocation;
}
function getModuleExplicitLocation(roots, relativePath) {
    var _a;
    var defaultLocation = (_a = (0, directories_1.findFirstGlob)(roots, "dist/dynamic/**/".concat(relativePath), filterNonStableLocation)) === null || _a === void 0 ? void 0 : _a.split('/dynamic/').pop();
    if (defaultLocation) {
        return defaultLocation;
    }
    throw new Error("Could not find source file for ".concat(relativePath, " in any of ").concat(roots, "!"));
}
var HARDCODED_COMPONENTS = {};
if (directories_1.CORE_DIRECTORIES.length > 0) {
    HARDCODED_COMPONENTS = {
        getResizeObserver: getModuleExplicitLocation(directories_1.CORE_DIRECTORIES, 'helpers/resizeObserver'),
        useOUIAProps: getModuleExplicitLocation(directories_1.CORE_DIRECTORIES, 'helpers/OUIA/ouia'),
        OUIAProps: getModuleExplicitLocation(directories_1.CORE_DIRECTORIES, 'helpers/OUIA/ouia'),
        getDefaultOUIAId: getModuleExplicitLocation(directories_1.CORE_DIRECTORIES, 'helpers/OUIA/ouia'),
        useOUIAId: getModuleExplicitLocation(directories_1.CORE_DIRECTORIES, 'helpers/OUIA/ouia'),
        handleArrows: getModuleExplicitLocation(directories_1.CORE_DIRECTORIES, 'helpers/KeyboardHandler'),
        setTabIndex: getModuleExplicitLocation(directories_1.CORE_DIRECTORIES, 'helpers/KeyboardHandler'),
        IconComponentProps: getModuleExplicitLocation(directories_1.CORE_DIRECTORIES, 'components/Icon'),
        TreeViewDataItem: getModuleExplicitLocation(directories_1.CORE_DIRECTORIES, 'components/TreeView'),
        Popper: getModuleExplicitLocation(directories_1.CORE_DIRECTORIES, 'helpers/Popper/Popper'),
        clipboardCopyFunc: getModuleExplicitLocation(directories_1.CORE_DIRECTORIES, 'components/ClipboardCopy'),
        ToolbarChipGroup: getModuleExplicitLocation(directories_1.CORE_DIRECTORIES, 'components/Toolbar'),
        DatePickerRef: getModuleExplicitLocation(directories_1.CORE_DIRECTORIES, 'components/DatePicker'),
        ButtonType: getModuleExplicitLocation(directories_1.CORE_DIRECTORIES, 'components/Button'),
        PaginationTitles: getModuleExplicitLocation(directories_1.CORE_DIRECTORIES, 'components/Pagination'),
        ProgressMeasureLocation: getModuleExplicitLocation(directories_1.CORE_DIRECTORIES, 'components/Progress'),
        isValidDate: getModuleExplicitLocation(directories_1.CORE_DIRECTORIES, 'helpers/datetimeUtils'),
        ValidatedOptions: getModuleExplicitLocation(directories_1.CORE_DIRECTORIES, 'helpers/constants'),
        capitalize: getModuleExplicitLocation(directories_1.CORE_DIRECTORIES, 'helpers/util'),
        WizardFooterWrapper: getModuleExplicitLocation(directories_1.CORE_DIRECTORIES, 'components/Wizard'),
        WizardFooter: getModuleExplicitLocation(directories_1.CORE_DIRECTORIES, 'components/Wizard'),
        WizardContextProvider: getModuleExplicitLocation(directories_1.CORE_DIRECTORIES, 'components/Wizard'),
        useWizardContext: getModuleExplicitLocation(directories_1.CORE_DIRECTORIES, 'components/Wizard'),
        DataListWrapModifier: getModuleExplicitLocation(directories_1.CORE_DIRECTORIES, 'components/DataList'),
        MenuToggleElement: getModuleExplicitLocation(directories_1.CORE_DIRECTORIES, 'components/MenuToggle'),
        TimestampFormat: getModuleExplicitLocation(directories_1.CORE_DIRECTORIES, 'components/Timestamp'),
    };
}
function guessComponentModule(nameBinding) {
    var _a;
    var modulePath = HARDCODED_COMPONENTS[nameBinding];
    if (modulePath) {
        return modulePath;
    }
    var sourceGlob = getPossibleLocations(directories_1.CORE_DIRECTORIES, nameBinding);
    var sourceFile = sourceGlob ? glob.sync(sourceGlob) : [];
    if (sourceFile.length < 1) {
        throw new Error("Unable to find source file for module ".concat(nameBinding, "! The module likely does not have unique file as is included within another file. Please add the entry into the COMPONENTS_CACHE in FEC repository"));
    }
    var moduleSource = ((_a = sourceFile[0].split('esm').pop()) === null || _a === void 0 ? void 0 : _a.split('/')) || [];
    moduleSource === null || moduleSource === void 0 ? void 0 : moduleSource.pop();
    modulePath = moduleSource === null || moduleSource === void 0 ? void 0 : moduleSource.join('/').replace(/^\//, '');
    return modulePath;
}
exports.default = guessComponentModule;
//# sourceMappingURL=guess-module.js.map