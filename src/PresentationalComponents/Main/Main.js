import React from 'react';
import propTypes from 'prop-types';

/**
 * This is a component that wraps the page
 */

const Main = ({className, ...props}) => {

    let mainClasses = classNames(
        className,
        'pf-l-page__main-section'
    );

    return (
        <section { ...props } className={ mainClasses }>
            {this.props.children}
        </section>
    );
};

export default Main;

PageHeader.propTypes = {
  children: propTypes.any.isRequired
};