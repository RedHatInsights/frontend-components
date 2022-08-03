import React, { useState } from 'react';
import { createUseStyles } from 'react-jss';
import ConditionalFilter from '@redhat-cloud-services/frontend-components/ConditionalFilter';

const useStyle = createUseStyles({
  container: {
    margin: 'auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'baseline',
    '& .ins-c-conditional-filter': {
      marginRight: 20,
    },
  },
});

const CFExample = () => {
  const classes = useStyle();
  const [value, setValue] = useState('');
  return (
    <div className={classes.container}>
      {/** No props */}
      <ConditionalFilter />
      {/** placeholder */}
      <ConditionalFilter placeholder="Some val" />
      {/** Controlled input */}
      <ConditionalFilter value={value} onChange={(_e, value) => setValue(value)} />
    </div>
  );
};

export default CFExample;
