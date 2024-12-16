# Cypress Utility functions

The [cypress](https://www.cypress.io/) library is a great tool that allows to write scalable component tests.

These utility functions are created to create scalable tests utilizing Patternfly UI library.

## Usage
1) Install Cypress v10+ on your project. You can find the documentation [here](https://docs.cypress.io/guides/component-testing/quickstart-react).
2) Go through the installation and setup, then set up the first component test.
3) Add more tests for components utilizing the functions we provide.

### Table Functions
**checkTableHeaders** - Check the table column headers to be equal to provided array of objects with titles. Each title = string.

**checkRowCounts** - Check if the table setting of "rows shown" is equal to the passed number parameter.

**columnName2UrlParam** - Checks the URL for the name of the column which sorting is "active".

**tableIsSortedBy** - Check the table sorting by the passed string parameter.

**checkEmptyState** - Check the empty state message by the passed string parameter.
Optionally checks for the "checkIcon" if you pass true as a second parameter.

### Pagination Functions
**itemsPerPage** - Checks if the table shows the correct number of items per page.

**checkPaginationTotal** - Checks pagination total.

**checkPaginationValues** - Checks pagination dropdown values.

**changePagination** - Changes page limit and check if the URL contains the limit=pagination value
```JS
cy.wrap(PAGINATION_VALUES).each((el) => {
 changePagination(el).then(() => {
  expect(window.location.search).to.contain(`limit=${el}`);
});
});
```

### Filter Functions
**applyFilters** - Apply a given set of filters taken into account the filters configuration.

**urlParamConvert** - Converts URL parameters to the values and checks if filter chips with such values exists.
```JS
// urlParamConvert filter parameter example
FILTER_CATEGORIES = {
 total_risk: {
 type: 'checkbox',
 title: 'total risk',
 urlParam: 'total_risk',
 values: [
    { label: TOTAL_RISK_LABEL[4], value: '4' },
    { label: TOTAL_RISK_LABEL[3], value: '3' },
    { label: TOTAL_RISK_LABEL[2], value: '2' },
    { label: TOTAL_RISK_LABEL[1], value: '1' },
  ],
},
}
// urlParamConvert test example
it('recognizes all parameters', () => {
      const urlSearchParameters = new URLSearchParams(urlParams);
      for (const [key, value] of urlSearchParameters) {
        if (key == 'text') {
          hasChip('Name', value);
          cy.get('.pf-m-fill > .pf-v6-c-form-control').should('have.value', value);
        } else {
          value.split(',').forEach((it) => {
            const [group, item] = urlParamConvert(key, it, FILTER_CATEGORIES);
            hasChip(group, item);
          });
        }
      }
      // do not get more chips than expected
      cy.get(CHIP_GROUP).should(
        'have.length',
        Array.from(urlSearchParameters).length
      );
    });
```

**hasChip** - Checks if the filter chip group contain the chip with the passed name and value.

**filter** - filter data given a set of filter values and their configuration.

**removeAllChips** - Removes all active chips

### Cypress custom commands
To make Cypress commands available you need either to initialize them in the file where you import them OR add them manually to the **cypress/support/commands.js** file.

#### Add custom commands locally
Open **cypress/support/commands.js** and add them there. After that the cypress command is available in the entire project.
```JS
Cypress.Commands.add(
  'ouiaId',
  { prevSubject: 'optional' },
  (subject, item, el = '') => {
    const attr = `${el}[data-ouia-component-id="${item}"]`;
    return subject ? cy.wrap(subject).find(attr) : cy.get(attr);
  }
);

Cypress.Commands.add(
  'ouiaType',
  { prevSubject: 'optional' },
  (subject, item, el = '') => {
    const attr = `${el}[data-ouia-component-type="${item}"]`;
    return subject ? cy.wrap(subject).find(attr) : cy.get(attr);
  }
);
```

#### Importing the custom commands
Import the functions and initialize them like in the example below.
After that the cypress command is available in the entire file.
```JS
import { findElementByOuiaId } from 'x';
findElementByOuiaId()
```
**findElementByOuiaId**
this functions adds a **cy.ouiaId** command that allows to better find elements by the ouiaId or you can chain **.ouiaId** off the other cy. methods.

ouiaId accepts 3 parameters: (subject, item, el = '')
```JS
${el}[data-ouia-component-id="${item}"]
if the subject is true it wraps it and finds ${el}[data-ouia-component-id="${item}"]
otherwise it runs cy.get(${el}[data-ouia-component-id="${item}"])
```
**findElementByOuiaType**
this functions adds a **cy.ouiaType** command that allows to better find elements by the ouiaType or you can chain **.ouiaType** off the other cy. methods.

ouiaType accepts 3 parameters: (subject, item, el = '')
```JS
${el}[data-ouia-component-type="${item}"]
if the subject is true it wraps it and finds ${el}[data-ouia-component-type="${item}"]
otherwise it runs cy.get(${el}[data-ouia-component-type="${item}"])
```

### Selectors and default values
```
DEFAULT_ROW_COUNT = 20;
PAGINATION_VALUES = [10, 20, 50, 100];
SORTING_ORDERS = ['ascending', 'descending'];
TOOLBAR = 'div[id="ins-primary-data-toolbar"]';
CHIP_GROUP = 'div[data-ouia-component-type="PF4/ChipGroup"]';
CHIP = '[data-ouia-component-type="PF4/Chip"]';
ROW = '[data-ouia-component-type="PF4/TableRow"]:not([class~="pf-v6-c-table__expandable-row"])';
PAGINATION = 'div[data-ouia-component-type="PF4/Pagination"]';
PAGINATION_MENU = 'div[data-ouia-component-type="PF4/PaginationOptionsMenu"]';
DROPDOWN = '[data-ouia-component-type="PF4/Dropdown"]';
MODAL = '[data-ouia-component-type="PF4/ModalContent"]';
CHECKBOX = '[data-ouia-component-type="PF4/Checkbox"]';
TEXT_INPUT = '[data-ouia-component-type="PF4/TextInput"]';
DROPDOWN_TOGGLE = '[data-ouia-component-type="PF4/DropdownToggle"]';
DROPDOWN_ITEM = '[data-ouia-component-type="PF4/DropdownItem"]';
TBODY = 'tbody[role=rowgroup]';
TOOLBAR_FILTER = '.ins-c-primary-toolbar__filter';
TABLE = 'table';
TABLE_HEADER = 'thead';
ROWS_TOGGLER = `${TABLE_HEADER} .pf-v6-c-table__toggle`;
TITLE = '[data-ouia-component-type="PF4/Title"]';
ouiaId = (id) => `[data-ouia-component-id="${id}"]`;
FILTERS_DROPDOWN = 'ul[class=pf-v6-c-dropdown__menu]';
FILTER_TOGGLE = 'button[class=pf-v6-c-select__toggle]';
```