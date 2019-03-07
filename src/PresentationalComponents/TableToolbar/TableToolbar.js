import React, { Fragment } from 'react';
import propTypes from 'prop-types';
import { Toolbar } from '@patternfly/react-core';
import classNames from 'classnames';

import './TableToolbar.scss';

function generateResults(results) {
    if (results > 1 || results < 1) {
        return (`${results} Results`);
    } else {
        return (`${results} Result`);
    }
}

const TableToolbar = ({ isFooter, results, className, children, ...props }) => {

    const tableToolbarClasses = classNames(
        'ins-c-table__toolbar',
        { [`ins-m-footer`]: isFooter },
        className
    );

    return (
        <Fragment>
            <Toolbar className={ tableToolbarClasses } { ...props }> { children }</Toolbar>
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
    isFooter: propTypes.bool,
    results: propTypes.number,
    children: propTypes.any,
    className: propTypes.string
};

TableToolbar.defaultProps = {
    isFooter: false
};
