import React from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import { createUseStyles } from 'react-jss';

const ReactJson = dynamic(() => import('react-json-view'), { ssr: false });

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
      <ReactJson className="foo" theme="apathy" collapsed={3} src={src} />
    </div>
  );
};

ExtensiveProp.propTypes = {
  data: PropTypes.any,
};

export default ExtensiveProp;
