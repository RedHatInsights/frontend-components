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

const LowSeverity = () => {
  const classes = useStyle();
  return (
    <div className={classes.container}>
      <Battery label="With prop: 1" severity={1} />
      <Battery label="With prop: low" severity="low" />
      <Battery label="With prop: info" severity="info" />
    </div>
  );
};

export default LowSeverity;
