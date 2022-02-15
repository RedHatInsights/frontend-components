import propTypes from 'prop-types';

export const isSelectedColumn = (selectedColumns, value) => selectedColumns.includes(value);

export const columnShape = propTypes.shape({
  key: propTypes.string.isRequired,
  title: propTypes.string,
  isRequired: propTypes.bool,
});
