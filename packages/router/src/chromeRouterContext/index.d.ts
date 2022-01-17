interface ChromeRouterContext {
  value: {
    basename: string;
    prependPath: (path?: string) => string;
    removePathPrefix: (path?: string) => string;
    prependTo: (to?: string | { pathname: string }) => string | { pathname: string };
  };
}

export default RendererContext;
