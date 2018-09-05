import React from 'react';
import propTypes from 'prop-types';
import classNames from 'classnames';

/**
 * This is the title section of the pageHeader
 */

const PageHeaderTitle = ({ className, title }) => {

    let pageHeaderTitleClasses = classNames(
        className,
        'ins-p-page-header__title'
    );

    return (
        <h1 className={ pageHeaderTitleClasses }> { title } </h1>
    );
};

export default PageHeaderTitle;

PageHeaderTitle.propTypes = {
    title: propTypes.string.isRequired,
    className: propTypes.string
};
