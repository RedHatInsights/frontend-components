import React from 'react';
import { createUseStyles } from 'react-jss';
import { CriticalBattery } from '@redhat-cloud-services/frontend-components/Battery';

const useStyle = createUseStyles({
  container: {
    maxWidth: 48,
    margin: 'auto',
  },
});

const NormalExample = () => {
  const classes = useStyle();
  return (
    <div className={classes.container}>
      <svg x="0px" y="0px" viewBox="0 0 448 512" shapeRendering="geometricpresision">
        <CriticalBattery />
      </svg>
    </div>
  );
};

export default NormalExample;
