const path = require('path');
const yaml = require('js-yaml');
const fs = require('fs');

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
    register({ app, config }) {
        app.get('/api/entitlements/v1/services', (_req, res) => {
            try {
                const configPath = path.join(config.entitlements.assets['entitlements-config'], '/configs/stage/bundles.yml');

                // Use { json: true } in case of duplicate keys
                const outerYaml = yaml.load(fs.readFileSync(configPath, 'utf8'), { json: true });
                const serviceSKUs = yaml.load(outerYaml.objects[0].data['bundles.yml'], { json: true });

                const services = serviceSKUs.map(serviceSKU => serviceSKU.name);
                // Grant access to all services
                const entitlements = services.reduce((acc, cur) => {
                    acc[cur] = { is_entitled: true, is_trial: false };
                    return acc;
                }, {});

                res.json(entitlements);
            } catch (error) {
                res.status(500).json({ error });
            }
        });
    },
});
