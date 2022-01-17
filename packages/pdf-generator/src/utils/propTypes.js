import PropTypes from 'prop-types';

export const styleProps = PropTypes.shape({
  [PropTypes.string]: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
});

export const customProps = PropTypes.shape({
  [PropTypes.string]: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  style: styleProps,
});
