import React, { Fragment } from 'react';
import propTypes from 'prop-types';
import { Toolbar } from '@patternfly/react-core';
import classNames from 'classnames';

import './TableToolbar.scss';

function generateCount(results) {
    if (results > 1 || results < 1) {
        return (`${results} Results`);
    } else {
        return (`${results} Result`);
    }
}

const TableToolbar = ({ isFooter, results, className, selected, children, ...props }) => {

    const tableToolbarClasses = classNames(
        'ins-c-table__toolbar',
        { [`ins-m-footer`]: isFooter },
        className
    );

    return (
        <Fragment>
            <Toolbar className={ tableToolbarClasses } { ...props }> { children }</Toolbar>
            {
                (results >= 0 || selected >= 0) &&
                <div className='ins-c-table__toolbar-results'>
                    { results >= 0 &&
                        <span className='ins-c-table__toolbar-results-count'> { generateCount(results) } </span>
                    }
                    { selected >= 0 &&
                        <span className='ins-c-table__toolbar-results-selected'> { selected } Selected </span>
                    }
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
    className: propTypes.string,
    selected: propTypes.number
};

TableToolbar.defaultProps = {
    isFooter: false
};
