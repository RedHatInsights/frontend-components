import React, { useEffect } from 'react';
import { matchPath, useLocation, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

export type RouterParamsProps = {
  [key: string]: any;
  Component: React.ComponentType;
};

const RouterParams = (props: RouterParamsProps) => {
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
    if (matchPath(pathname, { path: props?.match?.path, exact: true })) {
      onPathChange({
        params,
        path: pathname,
      });
    }
  }, [pathname, JSON.stringify(params)]);

  const { Component, ...rest } = props;
  return <Component {...rest} />;
};

// eslint-disable-next-line react/display-name
export default (Component: React.ComponentType) => (props: Record<string, any>) => <RouterParams Component={Component} {...props} />;
