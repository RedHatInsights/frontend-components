import React from 'react';
import propTypes from 'prop-types';
import classNames from 'classnames';

/**
 * This is a page header that mimics the patternfly layout for a header section
 */

const PageHeader = ({ className, children, style }) => {

    let pageHeaderClasses = classNames(
        className,
        'pf-l-page__main-section',
        [`pf-m-${style}`]
    );

    return (
        <section className={ pageHeaderClasses }>
            <div className='pf-c-content'>
                { children }
            </div>
        </section>
    );
};

export default PageHeader;

PageHeader.propTypes = {
    children: propTypes.any.isRequired,
    className: propTypes.string,
    style: propTypes.oneOf(['light', 'dark-100', 'dark-200'])
};

PageHeader.defaultProps = {
    style: 'light'
};
