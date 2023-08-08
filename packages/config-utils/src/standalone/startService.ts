// Starts services for `standalone: true` using docker images from quay
import { execSync } from 'child_process';
import { NET } from './helpers';

export async function startService(
  services: {
    [service: string]: {
      services: {
        [subService: string]: {
          startMessage: string;
        };
      };
    };
  },
  name: string,
  subService: { args: string[]; dependsOn: string[] }
) {
  const args = subService.args.filter(Boolean).join(' \\\n');
  // Remove existing container
  execSync(`docker container rm --force ${name}`);

  // Wait for dependencies to start
  for (const dep of subService.dependsOn || []) {
    const [project, subService] = dep.split('_');
    const { startMessage } = services[project].services[subService];

    console.log('Waiting for', dep);
    while (!execSync(`docker logs ${dep} 2>&1`).toString().includes(startMessage)) {
      console.log('Waiting for', dep);
      await new Promise((res) => setTimeout(res, 1000));
    }
    // RBAC is sad without this extra delay
    await new Promise((res) => setTimeout(res, 500));
  }

  // Start container
  execSync(`docker run --detach --name ${name} --network ${NET} --pull always ${args}`, { stdio: 'inherit' });
}

export function stopService(name: string) {
  // stop container
  console.log('stopping', name);
  execSync(`docker stop ${name}`);
}
