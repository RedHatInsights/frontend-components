import React, { Component } from 'react';
import propTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import ThemeContext from '../Dark/configContext';
import toKebab from '../../functions/toKebab';

/**
 * This is a component that wraps the page
 */
export class Main extends Component {
    calculateLocation () {
        const { path, params } = this.props;
        const chromeState = insights && insights.chrome.$internal.store.getState();
        if (path && chromeState) {
            return path.split('/').reduce((acc, curr) => {
                if (curr.indexOf(':') === 0) {
                    acc.dynamic = {
                        ...acc.dynamic,
                        [`data-${toKebab(curr.substr(1))}`]: params[curr.substr(1)]
                    };
                } else {
                    acc.staticPart = [ ...acc.staticPart, ...curr !== '' ? [ curr ] : [] ];
                }

                return acc;
            }, { staticPart: [ chromeState.chrome.appId ], dynamic: {}});
        }

        return {
            staticPart: []
        };
    }
    render () {
        const { className, children, params, path, ...props } = this.props;
        const { dynamic, staticPart } = this.calculateLocation();
        return (
            <ThemeContext.Consumer>
                { (theme = 'light') => {

                    let themeClasses = classNames(
                        { [`pf-m-${ theme }`]: theme  === 'dark' }
                    );

                    return {
                        dark:
                          <section { ...props }
                              { ...dynamic }
                              page-type={ staticPart.join('-') }
                              className={ `${ classNames(className, 'pf-l-page__main-section') } ${ themeClasses }` }
                          >
                              { React.Children.map(children, child => {
                                  return React.cloneElement(child, {
                                      className: 'pf-m-dark'
                                  });
                              }) }
                          </section>,
                        light:
                          <section { ...props }
                              { ...dynamic }
                              page-type={ staticPart.join('-') }
                              className={ `${ classNames(className, 'pf-l-page__main-section') }` }
                          >
                              { children }
                          </section>
                    } [theme];
                } }
            </ThemeContext.Consumer>
        );
    }
}

Main.propTypes = {
    className: propTypes.string,
    children: propTypes.any.isRequired,
    params: propTypes.any,
    path: propTypes.string
};

export default connect(({ routerData }) => ({
    params: routerData && routerData.params,
    path: routerData && routerData.path
}), () => ({}))(Main);
