import path from 'path';
import yaml from 'js-yaml';
import fs from 'fs';
import { Application } from 'express';

// Entitlements-config has master (which is ci), prod, qa
function getEntitlementsBranch(env: string) {
  if (env.startsWith('prod')) {
    return 'prod';
  } else if (env.startsWith('qa')) {
    return 'qa';
  }

  return 'master';
}

const entitlements = ({ env }: { env: string }) => ({
  assets: {
    'entitlements-config': `https://github.com/redhatinsights/entitlements-config#${getEntitlementsBranch(env)}`,
  },
  register({
    app,
    config,
  }: {
    app: Application;
    config: {
      entitlements: {
        assets: {
          'entitlements-config': string;
        };
      };
    };
  }) {
    app.get('/api/entitlements/v1/services', (_req, res) => {
      try {
        const configPath = path.join(config.entitlements.assets['entitlements-config'], '/configs/stage/bundles.yml');

        // Use { json: true } in case of duplicate keys
        const outerYaml = yaml.load(fs.readFileSync(configPath, 'utf8'), { json: true }) as Record<string, any>;
        const serviceSKUs = yaml.load(outerYaml.objects[0].data['bundles.yml'], { json: true }) as Record<string, any>[];

        const services = serviceSKUs.map((serviceSKU) => serviceSKU.name);
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

export default entitlements;
