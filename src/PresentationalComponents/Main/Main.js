import React from 'react';
import propTypes from 'prop-types';
import classNames from 'classnames';

import ThemeContext from '../Dark/configContext';

/**
 * This is a component that wraps the page
 */

const Main = ({ className, children, ...props }) => {

    let mainClasses = classNames(
        className,
        'pf-l-page__main-section'
    );

    return (
        <ThemeContext.Consumer>
            { theme => {

                let themeClasses = classNames(
                    { [`pf-m-${ theme }`]: theme  === 'dark' }
                );

                return (
                    <section { ...props } className={ `${ mainClasses } ${ themeClasses }` }>
                        { children }
                    </section>
                );
            } }
        </ThemeContext.Consumer>
    );
};

export default Main;

Main.propTypes = {
    className: propTypes.string,
    children: propTypes.any.isRequired
};
