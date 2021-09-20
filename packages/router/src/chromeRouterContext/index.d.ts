interface ChromeRouterContext {
    value: {
        basename: string,
        prependPath: (prefix: string, path: string) => string
    };
  }
  
  export default RendererContext;