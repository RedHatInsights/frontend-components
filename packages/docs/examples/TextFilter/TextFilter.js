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

export const textFilterConfig = {
  label: 'name',
  type: 'text', // for text filter this is optional
  value: 'text-filter', // optional identifier when activating filter
  filterValues: {},
  // id: 'some-id', // optional ID
};

const TextFilter = () => {
  const classes = useStyle();
  const [value, setValue] = useState('');
  return (
    <div className={classes.container}>
      {/** No additional config */}
      <ConditionalFilter items={[textFilterConfig]} />
      {/** Controlled input */}
      <ConditionalFilter items={[{ ...textFilterConfig, filterValues: { value, onChange: (_e, val) => setValue(val) } }]} />
    </div>
  );
};

export default TextFilter;
