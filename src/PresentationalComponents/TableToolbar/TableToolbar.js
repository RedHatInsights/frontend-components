import React from 'react';
import propTypes from 'prop-types';

import classNames from 'classnames';

import './TableToolbar.scss';

const TableToolbar = ({ className, children, ...props }) => {

    const tableToolbarClasses = classNames(
        'ins-c-table__toolbar',
        className
    );

    return (
        <div className={ tableToolbarClasses } { ...props }> { children } </div>
    );
};

export default TableToolbar;

TableToolbar.propTypes = {
    children: propTypes.any,
    className: propTypes.string
};
