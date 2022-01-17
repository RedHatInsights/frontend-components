import React from 'react';
import DateFormat from '@redhat-cloud-services/frontend-components/DateFormat';

const DateFormats = () => {
  const date = new Date();
  return (
    <div>
      <span>relative (default type): &nbsp;</span>
      <DateFormat type="relative" date={date} />
      <br />
      <span>exact: &nbsp;</span>
      <DateFormat type="exact" date={date} />
      <br />
      <span>onlyDate: &nbsp;</span>
      <DateFormat type="onlyDate" date={date} />
      <br />
    </div>
  );
};

export default DateFormats;
