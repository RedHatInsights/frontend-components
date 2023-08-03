/* eslint-disable react/display-name */
import React, { useEffect } from 'react';
import { matchPath, useLocation, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

export type RouterParamsProps = {
  [key: string]: any;
  Component: React.ComponentType;
};

/**
 * @deprecated
 */
const RouterParamsInternal = (props: RouterParamsProps) => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const params = useParams();

  const onPathChange = (data: any) =>
    dispatch({
      type: '@@INSIGHTS-CORE/NAVIGATION',
      payload: data,
    });

  useEffect(() => {
    // This will not work in router v6. Route does not pass `match` to child element.
    try {
      // @ts-ignore
      if (matchPath(pathname, { path: props?.match?.path, exact: true })) {
        onPathChange({
          params,
          path: pathname,
        });
      }
    } catch (error) {
      console.error('Unable to handle patch change', error);
    }
  }, [pathname, JSON.stringify(params)]);

  const { Component, ...rest } = props;
  return <Component {...rest} />;
};

/**
 * @deprecated
 */
const RouterParams = (Component: React.ComponentType) => (props: Record<string, any>) => <RouterParamsInternal Component={Component} {...props} />;
export default RouterParams;
