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

const MediumSeverity = () => {
  const classes = useStyle();
  return (
    <div className={classes.container}>
      <Battery label="With prop: 2" severity={2} />
      <Battery label="With prop: medium" severity="medium" />
      <Battery label="With prop: warn" severity="warn" />
    </div>
  );
};

export default MediumSeverity;
