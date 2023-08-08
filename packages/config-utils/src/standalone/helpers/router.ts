import { Request } from 'express';

type Router = import('http-proxy-middleware').Options['router'];

const router: (target: string, useCloud: boolean) => Router = (target: string, useCloud?: boolean) => {
  return (req: Request) => {
    switch (req.hostname) {
      case 'ci.foo.redhat.com':
        return `https://ci.${useCloud ? 'cloud' : 'console'}.redhat.com/`;
      case 'qa.foo.redhat.com':
        return `https://qa.${useCloud ? 'cloud' : 'console'}.redhat.com/`;
      case 'stage.foo.redhat.com':
        return `https://${useCloud ? 'cloud' : 'console'}.stage.redhat.com/`;
      case 'prod.foo.redhat.com':
        return `https://${useCloud ? 'cloud' : 'console'}.redhat.com/`;
      default:
        return target;
    }
  };
};

export default router;
