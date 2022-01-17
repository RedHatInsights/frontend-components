import React from 'react';
import DateFormat from '@redhat-cloud-services/frontend-components/DateFormat';

const DifferentDateDataTypes = () => (
  <div>
    <span>Using Date object: &nbsp;</span>
    <DateFormat date={new Date()} />
    <br />
    <span>Using number: &nbsp;</span>
    <DateFormat date={Date.now()} />
    <br />
    <span>Using date string: &nbsp;</span>
    <DateFormat date={new Date().toString()} />
    <br />
  </div>
);

export default DifferentDateDataTypes;
