import React from 'react';
import ThemeContext from './DarkContext';

const DarkContext: React.FunctionComponent<React.PropsWithChildren> = ({ children, ...props }) => (
  <ThemeContext.Provider {...props} value="dark">
    {children}
  </ThemeContext.Provider>
);

export default DarkContext;
