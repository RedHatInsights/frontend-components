import React from 'react';
import propTypes from 'prop-types';

import ThemeContext from './configContext';

const Dark = ({ children, ...props }) => (
    <ThemeContext.Provider { ...props } value='dark'>
        { children }
    </ThemeContext.Provider>
);

export default Dark;

Dark.propTypes = {
    children: propTypes.node
};
