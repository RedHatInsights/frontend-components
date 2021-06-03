// Entitlements-config has master (which is ci), prod, qa
function getEntitlementsBranch(env) {
    if (env.startsWith('prod')) {
        return 'prod';
    }
    else if (env.startsWith('qa')) {
        return 'qa';
    }

    return 'master';
}

module.exports = ({ env }) => ({
    assets: {
        'entitlements-config': `https://github.com/redhatinsights/entitlements-config#${getEntitlementsBranch(env)}`
    },
    context: '/api/entitlements/v1',
    selfHandleResponse: true,
    onProxyReq(_proxyReq, req, res, config) {
        if (req.url === '/api/entitlements/v1/services') {
            const configPath = path.join(config.entitlements.assets['entitlements-config'], '/configs/bundles.yml');
            // Use { json: true } in case of duplicate keys
            const serviceSKUs = yaml.load(fs.readFileSync(configPath, 'utf8'), { json: true });
            const services = serviceSKUs.map(serviceSKU => serviceSKU.name);
            // Grant access to all services
            const entitlements = services.reduce((acc, cur) => {
                acc[cur] = { is_entitled: true, is_trial: false };
                return acc;
            }, {});
            res.json(entitlements);
        }
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404');
    }
});
