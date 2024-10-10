import { Request as ExpressRequest, Response } from 'express';
import jws from 'jws';
import type * as http from 'http';

export type Entitlement = {
  is_entitled?: boolean;
  is_trial?: boolean;
};
const defaultEntitlements: { [sku: string]: Entitlement } = {
  insights: { is_entitled: true },
  smart_management: { is_entitled: true },
  openshift: { is_entitled: true },
  hybrid: { is_entitled: true },
  migrations: { is_entitled: true },
  ansible: { is_entitled: true },
  cost_management: { is_entitled: true },
};
// webpack.config
function cookieTransform(
  proxyReq: http.ClientRequest,
  req: ExpressRequest,
  _res: Response,
  {
    entitlements = defaultEntitlements,
    user,
    internal,
    identity: customIdentity,
  }: {
    entitlements?: { [sku: string]: Entitlement };
    // FIXME: define the user object
    user: any;
    internal: any;
    identity: any;
  }
) {
  const { cookie, authorization } = req.headers;
  const match = cookie?.match(/cs_jwt=([^;]+)/) || authorization?.match(/^Bearer (.*)$/);

  if (match) {
    const cs_jwt = match[1];
    const sig = jws.decode(cs_jwt);
    if(!sig) {
      return;
    }
    const payload = sig.payload

    const identity = {
      entitlements,
      identity: {
        type: 'User',
        auth_type: 'basic-auth',
        account_number: payload.account_number + '',
        org_id: payload.org_id,
        ...customIdentity,
        user: {
          username: payload.username,
          email: payload.email,
          first_name: payload.first_name,
          last_name: payload.last_name,
          is_active: true,
          is_org_admin: payload.is_org_admin,
          is_internal: payload.is_internal,
          locale: 'en-US',
          user_id: payload.account_id + '',
          ...user,
        },
        internal: {
          org_id: payload.org_id,
          auth_time: payload.auth_time,
          ...internal,
        },
      },
    };
    const identityB64 = Buffer.from(JSON.stringify(identity), 'utf8').toString('base64');
    proxyReq.setHeader('x-rh-identity', identityB64);
  }
}

export default cookieTransform;
module.exports = cookieTransform;
