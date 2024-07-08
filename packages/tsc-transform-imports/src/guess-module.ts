import * as glob from 'glob';
import { CORE_DIRECTORIES, findFirstGlob } from './directories';

const PROPS_MATCH = /Props$/g;
const VARIANT_MATCH = /Variants?$/g;
const POSITION_MATCH = /Position$/g;
const SIZE_MATCH = /Sizes?$/g;

function filterNonStableLocation(location: string) {
  return !location.includes('next') && !location.includes('deprecated');
}

function getPossibleLocations(roots: string[], nameBinding: string) {
  let moduleLocation = findFirstGlob(roots, `dist/esm/**/${nameBinding}.js`, filterNonStableLocation);

  if (!moduleLocation && nameBinding.match(PROPS_MATCH)) {
    moduleLocation = findFirstGlob(roots, `dist/esm/**/${nameBinding.replace(PROPS_MATCH, '')}.js`, filterNonStableLocation);
  }

  if (!moduleLocation && nameBinding.match(VARIANT_MATCH)) {
    moduleLocation = findFirstGlob(roots, `dist/esm/**/${nameBinding.replace(VARIANT_MATCH, '')}.js`, filterNonStableLocation);
  }

  if (!moduleLocation && nameBinding.match(POSITION_MATCH)) {
    moduleLocation = findFirstGlob(roots, `dist/esm/**/${nameBinding.replace(POSITION_MATCH, '')}.js`, filterNonStableLocation);
  }

  if (!moduleLocation && nameBinding.match(SIZE_MATCH)) {
    moduleLocation = findFirstGlob(roots, `dist/esm/**/${nameBinding.replace(SIZE_MATCH, '')}.js`, filterNonStableLocation);
  }

  return moduleLocation;
}

function getModuleExplicitLocation(roots: string[], relativePath: string) {
  const defaultLocation = findFirstGlob(roots, `dist/dynamic/**/${relativePath}`, filterNonStableLocation)?.split('/dynamic/').pop();

  if (defaultLocation) {
    return defaultLocation;
  }

  throw new Error(`Could not find source file for ${relativePath} in any of ${roots}!`);
}

// Prefilled with modules which name bindings do not match the import specifier
let HARDCODED_COMPONENTS: {
  [nameBinding: string]: string;
} = {};

if (CORE_DIRECTORIES.length > 0) {
  HARDCODED_COMPONENTS = {
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

function guessComponentModule(nameBinding: string) {
  let modulePath = HARDCODED_COMPONENTS[nameBinding];
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
  return modulePath;
}

export default guessComponentModule;
