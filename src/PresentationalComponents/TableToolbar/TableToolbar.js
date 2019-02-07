import React, { Fragment } from 'react';
import propTypes from 'prop-types';

import classNames from 'classnames';

import './TableToolbar.scss';

function generateResults(results) {
    if (results > 1 || results < 1) {
        return (`${results} Results`);
    } else {
        return (`${results} Result`);
    }
}

const TableToolbar = ({ results, className, children, ...props }) => {

    const tableToolbarClasses = classNames(
        'ins-c-table__toolbar',
        className
    );

    return (
        <Fragment>
            <div className={ tableToolbarClasses } { ...props }> { children }</div>
            {
                results >= 0 &&
                <div className='ins-c-table__toolbar-results'>
                    { generateResults(results) }
                </div>
            }
        </Fragment>
    );
};

export default TableToolbar;

TableToolbar.propTypes = {
    results: propTypes.number,
    children: propTypes.any,
    className: propTypes.string
};
