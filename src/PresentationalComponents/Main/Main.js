import React from 'react';
import propTypes from 'prop-types';
import classNames from 'classnames';

/**
 * This is a component that wraps the page
 */

const Main = ({className, children, ...props}) => {

    let mainClasses = classNames(
        className,
        'pf-l-page__main-section'
    );

    return (
        <section { ...props } className={ mainClasses }>
            { children }
        </section>
    );
};

export default Main;

Main.propTypes = {
    className: propTypes.string,
    children: propTypes.any.isRequired
};