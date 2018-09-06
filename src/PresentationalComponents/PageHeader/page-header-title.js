import React from 'react';
import propTypes from 'prop-types';
import classNames from 'classnames';
import { Title } from '@patternfly/react-core';

/**
 * This is the title section of the pageHeader
 */

const PageHeaderTitle = ({ className, title }) => {

    let pageHeaderTitleClasses = classNames(
        className
    );

    return (
        <Title size='2xl' className={ pageHeaderTitleClasses }> { title } </Title>
    );
};

export default PageHeaderTitle;

PageHeaderTitle.propTypes = {
    title: propTypes.string.isRequired,
    className: propTypes.string
};
