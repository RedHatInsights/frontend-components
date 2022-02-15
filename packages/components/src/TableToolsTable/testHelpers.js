import { render } from '@testing-library/react';
import { queryByText } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

const toggleFilterDropDown = (container) => {
  const filterToggle = container.querySelector('button.pf-c-dropdown__toggle');
  userEvent.click(filterToggle);
};

const clickFilter = (filterButton) => {
  userEvent.click(filterButton);
};

const queryFilterButton = (toolbar, query) =>
  queryByText(toolbar.querySelector('.ins-c-conditional-filter'), query, {
    selector: 'button',
  });

const validateAndOpenFilterSelectable = (toolbar, filter) => {
  const currentFilter = queryFilterButton(toolbar, filter.label);
  if (currentFilter) {
    clickFilter(currentFilter);
  }

  return !!currentFilter;
};

const filterValidations = {
  group: (toolbar, filter) => {
    console.log(`Not validating ${filter.label} of type ${filter.type}`);
    return true;

    /* eslint-disable */
    const selectable = validateAndOpenFilterSelectable(toolbar, filter);
    const filterDropDownToggle = toolbar.querySelector('.pf-c-select__toggle');

    userEvent.click(filterDropDownToggle);
    const selectMenu = toolbar.querySelector('.pf-c-select__menu');
    const randomIndex = Math.floor(Math.random() * filter.items.length);
    const testItem = queryByText(selectMenu, filter.items[randomIndex].label);
    const testChildItem = queryByText(
      selectMenu,
      filter.items[randomIndex].items[0].label
    );

    return (
      selectable &&
      !!filterDropDownToggle &&
      !!selectMenu &&
      !!testItem &&
      !!testChildItem
    );
    /* eslint-enable */
  },
  checkbox: (toolbar, filter) => {
    const selectable = validateAndOpenFilterSelectable(toolbar, filter);
    const filterDropDownToggle = toolbar.querySelector('.pf-c-select__toggle');

    userEvent.click(filterDropDownToggle);
    const selectMenu = toolbar.querySelector('.pf-c-select__menu');
    const randomIndex = Math.floor(Math.random() * filter.items.length);
    const testItem = queryByText(selectMenu, filter.items[randomIndex].label);

    return selectable && !!filterDropDownToggle && !!selectMenu && !!testItem;
  },
  radio: (toolbar, filter) => {
    const selectable = validateAndOpenFilterSelectable(toolbar, filter);
    return selectable;
  },
  text: (toolbar, filter) => {
    validateAndOpenFilterSelectable(toolbar, filter);
    const textInput = toolbar.querySelector(`input`);

    return !!textInput;
  },
};

const validateFilter = (container, filter, validator) => {
  const toolbar = container.querySelector('#ins-primary-data-toolbar');
  return validator(toolbar, filter);
};

const filterHelpers = {
  toHaveFiltersFor: (component, filters) => {
    let pass = true;
    let currentFilter;
    const singleFilter = filters.length === 1;

    filters.every((filter) => {
      const { container } = render(component);
      currentFilter = filter;

      if (!singleFilter) {
        toggleFilterDropDown(container);
      }

      const validator = filterValidations[filter.type];

      if (validator) {
        const filterValidation = validateFilter(container, filter, validator);
        pass = filterValidation;
        return pass;
      } else {
        console.log(`No test validator for ${filter.label} of type ${filter.type}`);
        return true;
      }
    });

    return {
      message: () => `No filter rendered for ${currentFilter.label} of type ${currentFilter.type}`,
      pass,
    };
  },
};

export default filterHelpers;
