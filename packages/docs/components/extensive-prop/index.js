import React from 'react';
import PropTypes from 'prop-types';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  jsonContainer: {
    backgroundColor: '#031a16',
    borderRadius: 8,
    padding: 16,
  },
});

const ExtensiveProp = ({ data }) => {
  const classes = useStyles();
  const { required, description, defaultValue, ...src } = data;
  return (
    <div className={classes.jsonContainer}>
      <pre>
        {JSON.stringify(src)}
      </pre>
    </div>
  );
};

ExtensiveProp.propTypes = {
  data: PropTypes.any,
};

export default ExtensiveProp;
