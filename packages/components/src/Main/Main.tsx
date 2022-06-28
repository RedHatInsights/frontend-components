import React, { ReactElement } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { DarkContext } from '../Dark';
import './main.scss';
import type { ChromeAPI } from '@redhat-cloud-services/types';

declare global {
  interface Window {
    insights: {
      chrome: ChromeAPI;
    };
  }
}

const toKebab = (text: string) => text.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

export interface InternalMainProps {
  params?: { [key: string]: string };
  path?: string;
  className?: string;
  children?: React.ReactNode;
}

type FcalculateLocation = () => { staticPart: string[]; dynamic: undefined | { [key: string]: any } };

/**
 * This is a component that wraps the page
 */
export const InternalMain: React.FunctionComponent<InternalMainProps> = ({ path, params = {}, children, className, ...props }) => {
  const calculateLocation: FcalculateLocation = () => {
    if (window?.insights?.chrome?.$internal?.store) {
      const chromeState = window.insights.chrome.$internal.store.getState();
      if (path && chromeState) {
        return path.split('/').reduce(
          (acc, curr) => {
            if (curr.indexOf(':') === 0) {
              acc.dynamic = {
                ...acc.dynamic,
                [`data-${toKebab(curr.substr(1))}`]: params[curr.substr(1)],
              };
            } else {
              acc.staticPart = [...acc.staticPart, ...(curr !== '' ? [curr] : [])];
            }

            return acc;
          },
          { staticPart: [chromeState.chrome.appId], dynamic: {} }
        );
      }
    }

    return {
      staticPart: [],
      dynamic: undefined,
    };
  };

  const { dynamic, staticPart } = calculateLocation();
  return (
    <DarkContext.Consumer>
      {(theme = 'light') => {
        const themeClasses = classNames({ [`pf-m-${theme}`]: theme === 'dark' });

        return {
          dark: (
            <section
              {...props}
              {...dynamic}
              page-type={staticPart.join('-')}
              className={`${classNames(className, 'pf-l-page__main-section pf-c-page__main-section')} ${themeClasses}`}
            >
              {React.Children.map(children, (child) => {
                return React.cloneElement(child as ReactElement, {
                  className: 'pf-m-dark',
                });
              })}
            </section>
          ),
          light: (
            <section
              {...props}
              {...dynamic}
              page-type={staticPart.join('-')}
              className={`${classNames(className, 'pf-l-page__main-section pf-c-page__main-section')}`}
            >
              {children}
            </section>
          ),
        }[theme];
      }}
    </DarkContext.Consumer>
  );
};

type IRootState = {
  routerData?: {
    params?: { [key: string]: string };
    path: string;
  };
};

const mapStateToProps = ({ routerData }: IRootState) => ({
  params: routerData && routerData.params,
  path: routerData && routerData.path,
});

const Main = connect(mapStateToProps, () => ({}))(InternalMain);

export default Main;
