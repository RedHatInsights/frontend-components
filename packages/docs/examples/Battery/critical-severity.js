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

const CriticalSeverity = () => {
  const classes = useStyle();
  return (
    <div className={classes.container}>
      <Battery label="With prop: 4" severity={4} />
      <Battery label="With prop: critical" severity="critical" />
    </div>
  );
};

export default CriticalSeverity;
