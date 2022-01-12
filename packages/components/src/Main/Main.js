import React, { Component } from 'react';
import propTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { DarkContext } from '../Dark';
import './main.scss';

const toKebab = text => text.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

/**
 * This is a component that wraps the page
 */
export class Main extends Component {
    calculateLocation () {
        const { path, params } = this.props;
        if (insights && insights.chrome && insights.chrome.$internal && insights.chrome.$internal.store) {
            const chromeState = insights.chrome.$internal.store.getState();
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
                }, { staticPart: [ chromeState.chrome.appId ], dynamic: {} });
            }
        }

        return {
            staticPart: []
        };
    }
    render () {
        const { className, children, params, path, ...props } = this.props;
        const { dynamic, staticPart } = this.calculateLocation();
        return (
            <DarkContext.Consumer>
                { (theme = 'light') => {

                    let themeClasses = classNames(
                        { [`pf-m-${ theme }`]: theme  === 'dark' }
                    );

                    return {
                        dark:
                          <section { ...props }
                              { ...dynamic }
                              page-type={ staticPart.join('-') }
                              className={ `${ classNames(className, 'pf-l-page__main-section pf-c-page__main-section') } ${ themeClasses }` }
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
                              className={ `${ classNames(className, 'pf-l-page__main-section pf-c-page__main-section') }` }
                          >
                              { children }
                          </section>
                    } [theme];
                } }
            </DarkContext.Consumer>
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
