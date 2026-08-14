import React from 'react';
import ThemeContext from './DarkContext';

const DarkContext = ({ children, ...props }: React.PropsWithChildren) => (
  <ThemeContext.Provider {...props} value="dark">
    {children}
  </ThemeContext.Provider>
);

export default DarkContext;
