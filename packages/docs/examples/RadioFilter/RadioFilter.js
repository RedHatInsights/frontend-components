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

export const radioFilterConfig = {
  label: 'name',
  type: 'radio',
  value: 'radio-filter', // optional identifier when activating filter
  filterValues: {
    // If no items are passed the component defaults to text input
    items: [{
      label: <div>Some value</div> // value can be React.node
    }]
  },
  // id: 'some-id', // optional ID
};

const RadioFilter = () => {
  const classes = useStyle();
  const [value, setValue] = useState('');
  return (
    <div className={classes.container}>
      {/** No additional config */}
      <ConditionalFilter items={[radioFilterConfig]} />
      {/** Controlled input */}
      <ConditionalFilter items={[{ ...radioFilterConfig, filterValues: { value, onChange: (_e, val) => setValue(val) } }]} />
    </div>
  );
};

export default RadioFilter;
