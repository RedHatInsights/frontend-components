// @ts-nocheck
import React, { useMemo } from 'react';
import * as reactRouter from 'react-router-dom';
import useChrome from '../useChrome';

const WithReactRouterHistory = ({ Component, ...props }) => {
  const history = reactRouter.useHistory();

  return <Component history={history} {...props} />;
};

const WithChromeHistory = ({ Component, ...props }) => {
  const { chromeHistory } = useChrome();

  return <Component history={chromeHistory} {...props} />;
};

const WithHistory = ({ Component, ...props }, ref) => {
  const HistoryComponent = useMemo(
    () => (typeof reactRouter.useHistory === 'function' ? WithReactRouterHistory : WithChromeHistory),
    [Component, props]
  );

  return <HistoryComponent innerRef={ref} Component={Component} {...props} />;
};

export default React.forwardRef(WithHistory);
