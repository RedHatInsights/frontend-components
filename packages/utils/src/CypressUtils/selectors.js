const TOOLBAR = 'div[id="ins-primary-data-toolbar"]';
const CHIP_GROUP = 'div[data-ouia-component-type="PF5/ChipGroup"]';
const CHIP = '[data-ouia-component-type="PF5/Chip"]';
const ROW = '[data-ouia-component-type="PF5/TableRow"]:not([class~="pf-v5-c-table__expandable-row"])';
const PAGINATION = 'div[data-ouia-component-type="PF5/Pagination"]';
const PAGINATION_MENU = 'div[data-ouia-component-type="PF5/PaginationOptionsMenu"]';
const DROPDOWN = '[data-ouia-component-type="PF5/Dropdown"]';
const MODAL = '[data-ouia-component-type="PF5/ModalContent"]';
const CHECKBOX = '[data-ouia-component-type="PF5/Checkbox"]';
const TEXT_INPUT = '[data-ouia-component-type="PF5/TextInput"]';
const DROPDOWN_TOGGLE = '[data-ouia-component-type="PF5/DropdownToggle"]';
const DROPDOWN_ITEM = '[data-ouia-component-type="PF5/DropdownItem"]';
const TBODY = 'tbody[role=rowgroup]';
const TOOLBAR_FILTER = '.ins-c-primary-toolbar__filter';
const TABLE = 'table';
const TABLE_HEADER = 'thead';
const ROWS_TOGGLER = `${TABLE_HEADER} .pf-v5-c-table__toggle`;
const TITLE = '[data-ouia-component-type="PF5/Title"]';
const ouiaId = (id) => `[data-ouia-component-id="${id}"]`;
const FILTERS_DROPDOWN = 'ul[class=pf-v5-c-dropdown__menu]';
const FILTER_TOGGLE = 'button[class=pf-v5-c-select__toggle]';

export {
  ouiaId,
  TOOLBAR,
  CHIP_GROUP,
  CHIP,
  ROW,
  PAGINATION,
  PAGINATION_MENU,
  DROPDOWN,
  MODAL,
  CHECKBOX,
  TEXT_INPUT,
  DROPDOWN_TOGGLE,
  DROPDOWN_ITEM,
  TBODY,
  TOOLBAR_FILTER,
  TABLE,
  TABLE_HEADER,
  ROWS_TOGGLER,
  TITLE,
  FILTERS_DROPDOWN,
  FILTER_TOGGLE,
};
