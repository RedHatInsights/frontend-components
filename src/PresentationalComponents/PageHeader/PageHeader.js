import React from 'react';
import propTypes from 'prop-types';
import classNames from 'classnames';

import ThemeContext from '../Dark/configContext';

/**
 * This is a page header that mimics the patternfly layout for a header section
 */

const PageHeader = ({ className, children, ...props }) => {

    let pageHeaderClasses = classNames(
        className,
        'pf-l-page__main-section'
    );

    return (
        <ThemeContext.Consumer>
            { theme => {
                return (
                    <section className={ `${ pageHeaderClasses } pf-m-${ theme }` } widget-type='InsightsPageHeader'>
                        <div className='pf-c-content'>
                            { children }
                        </div>
                    </section>
                );
            } }
        </ThemeContext.Consumer>
    );
};

export default PageHeader;

PageHeader.propTypes = {
    children: propTypes.any.isRequired,
    className: propTypes.string
};
