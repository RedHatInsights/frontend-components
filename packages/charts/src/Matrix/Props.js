import PropTypes from 'prop-types';

export const CellDataProp = PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string }));

export const DataProps = PropTypes.shape({
  topLeft: PropTypes.any,
  topRight: PropTypes.any,
  bottomLeft: PropTypes.any,
  bottomRight: PropTypes.any,
});

export const ConfigProp = PropTypes.shape({
  max: PropTypes.number,
  min: PropTypes.number,
  size: PropTypes.number,
  gridSize: PropTypes.number,
  pad: PropTypes.number,
  shift: PropTypes.number,
  colors: PropTypes.arrayOf(PropTypes.string),
});

export const LabelsProp = PropTypes.shape({
  yLabel: PropTypes.string,
  xLabel: PropTypes.string,
  subLabels: PropTypes.shape({
    xLabels: PropTypes.arrayOf(PropTypes.string),
    yLabels: PropTypes.arrayOf(PropTypes.string),
  }),
});

export const ConfigDefaults = {
  max: 10,
  min: 0,
  size: 540,
  pad: 10,
  shift: 10,
  gridSize: 430,
  colors: ['#f0ab00', '#FF6666', '#d1d1d1', '#bee1f4'],
};

export const LabelsDefaults = {
  xLabel: 'Risk of change',
  yLabel: 'Impact',
  subLabels: {
    xLabels: ['Low', 'High'],
    yLabels: ['Low', 'High'],
  },
};
