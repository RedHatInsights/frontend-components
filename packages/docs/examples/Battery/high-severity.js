import React from 'react';
import { createUseStyles } from 'react-jss';
import Battery from '@redhat-cloud-services/frontend-components/Battery';

const useStyle = createUseStyles({
  container: {
    margin: 'auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'baseline',
    '& i': {
      marginLeft: 16,
      marginRight: 4,
    },
  },
});

const HighSeverity = () => {
  const classes = useStyle();
  return (
    <div className={classes.container}>
      <Battery label="With prop: 3" severity={3} />
      <Battery label="With prop: high" severity="high" />
      <Battery label="With prop: error" severity="error" />
    </div>
  );
};

export default HighSeverity;
