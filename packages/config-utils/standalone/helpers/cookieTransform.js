/* eslint-disable camelcase */
/* eslint-disable no-console */
const jws = require('jws');

function cookieTransform(proxyReq, req) {
    const cookie = req.headers.cookie;
    const match = cookie && cookie.match(/cs_jwt=([^;]+);/);
    if (match) {
        const cs_jwt = match[1];
        const { payload } = jws.decode(cs_jwt);

        const identity = {
            identity: {
                type: 'User',
                auth_type: 'basic-auth',
                account_number: payload.account_number + '',
                user: {
                    username: payload.username,
                    email: payload.email,
                    first_name: payload.first_name,
                    last_name: payload.last_name,
                    is_active: true,
                    is_org_admin: payload.is_org_admin,
                    is_internal: payload.is_internal,
                    locale: 'en-US',
                    user_id: payload.account_id + ''
                },
                internal: {
                    org_id: payload.org_id,
                    auth_time: payload.auth_time
                }
            }
        };
        const identityB64 = Buffer.from(JSON.stringify(identity), 'utf8').toString('base64');
        proxyReq.setHeader('x-rh-identity', identityB64);
    }
}

module.exports = cookieTransform;
