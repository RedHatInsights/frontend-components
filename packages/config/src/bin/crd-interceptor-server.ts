import http from 'http';
import https from 'https';
import { URL } from 'url';
import chokidar from 'chokidar';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { readFrontendCRD } from '@redhat-cloud-services/frontend-components-config-utilities/feo/crd-check';
import { FrontendCRD } from '@redhat-cloud-services/frontend-components-config-utilities/feo/feo-types';
import { modifyRequest } from '@redhat-cloud-services/frontend-components-config-utilities/feo/modify-response';
import { LogType, fecLogger } from '@redhat-cloud-services/frontend-components-config-utilities';

const PROXY_URL = 'http://squid.corp.redhat.com:3128';

export const CRD_INTERCEPTOR_PORT = 9997;

/**
 * The 4 chrome-service API endpoints that need CRD interception.
 * These are the same URLs matched by isInterceptAbleRequest() in config-utils.
 */
export const INTERCEPTABLE_PATHS = [
  '/api/chrome-service/v1/static/bundles-generated.json',
  '/api/chrome-service/v1/static/search-index-generated.json',
  '/api/chrome-service/v1/static/service-tiles-generated.json',
  '/api/chrome-service/v1/static/fed-modules-generated.json',
];

interface CRDInterceptorOptions {
  frontendCRDPath: string;
  port?: number;
  debug?: boolean;
}

/**
 * Starts a Node HTTP server that intercepts chrome-service API responses
 * and applies local CRD modifications via modifyRequest().
 *
 * This brings CRD interception support to `fec dev-proxy` mode, where the
 * Caddy container normally proxies /api/* directly to stage without any
 * local CRD awareness. The Caddy routes config directs the 4 interceptable
 * API paths to this server instead, which fetches from upstream, applies
 * CRD modifications, and returns the modified response.
 *
 * Reuses 100% of the existing interception code from config-utils:
 * navigationInterceptor, searchInterceptor, moduleInterceptor,
 * serviceTilesInterceptor (via modifyRequest).
 */
export async function startCRDInterceptorServer(options: CRDInterceptorOptions): Promise<http.Server> {
  const { frontendCRDPath, port = CRD_INTERCEPTOR_PORT, debug = false } = options;

  const log = (logType: LogType, ...data: any[]) => {
    if (logType === LogType.debug && !debug) return;
    fecLogger(logType, ...data);
  };

  // Read and watch the CRD file, same pattern as proxy.ts
  const frontendCrdRef: { current?: FrontendCRD } = { current: undefined };
  try {
    frontendCrdRef.current = readFrontendCRD(frontendCRDPath);
  } catch (e) {
    log(LogType.warn, `CRD interceptor: Unable to read frontend CRD at ${frontendCRDPath}`);
  }

  const watcher = chokidar.watch(frontendCRDPath).on('change', () => {
    log(LogType.info, 'CRD interceptor: Frontend CRD changed, reloading');
    try {
      frontendCrdRef.current = readFrontendCRD(frontendCRDPath);
    } catch (error) {
      log(LogType.error, 'CRD interceptor: Error reloading CRD', error);
    }
  });

  const hccEnvUrl = process.env.HCC_ENV_URL!;
  const isStage = process.env.HCC_ENV === 'stage';
  const agent = isStage ? new HttpsProxyAgent(PROXY_URL) : undefined;

  const server = http.createServer((req, res) => {
    const url = req.url || '/';

    if (!frontendCrdRef.current) {
      log(LogType.warn, `CRD interceptor: No CRD loaded, proxying ${url} without modification`);
      proxyPassthrough(url, req, res, hccEnvUrl, agent, log);
      return;
    }

    // Proxy to upstream (always HTTPS for HCC environments) and apply
    // CRD modifications to the response
    const upstreamUrl = new URL(url, hccEnvUrl);

    const headers: Record<string, string | string[] | undefined> = {
      ...req.headers,
      host: upstreamUrl.hostname,
    };
    // Prevent 304 responses that would bypass content modification
    delete headers['if-none-match'];
    delete headers['if-modified-since'];

    const proxyReq = https.request(
      {
        hostname: upstreamUrl.hostname,
        port: upstreamUrl.port || 443,
        path: upstreamUrl.pathname + upstreamUrl.search,
        method: req.method,
        headers,
        // HttpsProxyAgent v5 extends agent-base Agent, not https.Agent,
        // but is fully compatible at runtime
        agent: agent as https.Agent | undefined,
      },
      (proxyRes) => {
        let body = '';
        proxyRes.on('data', (chunk: Buffer) => {
          body += chunk.toString();
        });
        proxyRes.on('end', () => {
          try {
            const modified = modifyRequest(body, url, frontendCrdRef.current!);
            res.writeHead(200, {
              'content-type': 'application/json',
              'content-length': Buffer.byteLength(modified),
              'cache-control': 'no-store, no-cache, must-revalidate',
            });
            res.end(modified);
            log(LogType.debug, `CRD interceptor: Modified response for ${url}`);
          } catch (error) {
            log(LogType.error, `CRD interceptor: Error modifying response for ${url}`, error);
            res.writeHead(proxyRes.statusCode || 500, {
              'content-type': proxyRes.headers['content-type'] || 'application/json',
            });
            res.end(body);
          }
        });
      },
    );

    proxyReq.on('error', (error) => {
      log(LogType.error, `CRD interceptor: Upstream request failed for ${url}`, error);
      res.writeHead(502, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ error: 'Upstream request failed' }));
    });

    req.pipe(proxyReq);
  });

  const cleanup = () => {
    watcher.close();
  };

  process.on('SIGTERM', cleanup);
  process.on('SIGINT', cleanup);

  return new Promise((resolve, reject) => {
    server.listen(port, () => {
      log(LogType.info, `CRD interceptor server listening on port ${port}`);
      resolve(server);
    });
    server.on('error', reject);
  });
}

function proxyPassthrough(
  url: string,
  req: http.IncomingMessage,
  res: http.ServerResponse,
  hccEnvUrl: string,
  agent: HttpsProxyAgent | undefined,
  log: (logType: LogType, ...data: any[]) => void,
) {
  const upstreamUrl = new URL(url, hccEnvUrl);

  const proxyReq = https.request(
    {
      hostname: upstreamUrl.hostname,
      port: upstreamUrl.port || 443,
      path: upstreamUrl.pathname + upstreamUrl.search,
      method: req.method,
      headers: { ...req.headers, host: upstreamUrl.hostname },
      agent: agent as https.Agent | undefined,
    },
    (proxyRes) => {
      res.writeHead(proxyRes.statusCode || 200, proxyRes.headers);
      proxyRes.pipe(res);
    },
  );

  proxyReq.on('error', (error) => {
    log(LogType.error, `CRD interceptor: Passthrough request failed for ${url}`, error);
    res.writeHead(502);
    res.end('Upstream error');
  });

  req.pipe(proxyReq);
}

export default startCRDInterceptorServer;
