import React from 'react';
import DateFormat from '@redhat-cloud-services/frontend-components/DateFormat';

const date = new Date();
const extraStringTitle = 'Extra string title ';
const extraNodeTitle = <h2>Extra node title</h2>;

const ExtraTitle = () => (
  <div>
    <span>Extra tooltip title as string: &nbsp;</span>
    <DateFormat extraTitle={extraStringTitle} date={date} />
    <br />
    <span>Extra tooltip title as react node: &nbsp;</span>
    <DateFormat extraTitle={extraNodeTitle} date={date} />
    <br />
  </div>
);

export default ExtraTitle;
