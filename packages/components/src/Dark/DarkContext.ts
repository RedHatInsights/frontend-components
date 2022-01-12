import React from 'react';

export type IDarkContext = 'light' | 'dark';

const DarkContext = React.createContext<IDarkContext>('light');
export default DarkContext;
