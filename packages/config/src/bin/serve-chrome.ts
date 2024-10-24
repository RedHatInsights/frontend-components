import axios from 'axios';
import fs from 'fs';
import { execSync, spawn } from 'child_process';
import { LogType, fecLogger } from '@redhat-cloud-services/frontend-components-config-utilities';
import waitOn from 'wait-on';

const CONTAINER_PORT = 8000;
const CONTAINER_NAME = 'fec-chrome-local';
const IMAGE_REPO = 'quay.io/redhat-services-prod/hcc-platex-services-tenant/insights-chrome';
const LATEST_IMAGE_TAG = 'latest';
const GRAPHQL_ENDPOINT = 'https://app-interface.apps.rosa.appsrep09ue1.03r5.p3.openshiftapps.com/graphql';

type ContainerRuntime = 'docker' | 'podman';
let execBin: ContainerRuntime | undefined = undefined;

const APPS_QUERY = `{
  apps: apps_v1 {
    name
    parentApp {
      name
    }
    saasFiles {
      path
      name
      parameters
      resourceTemplates {
        name
        path
        url
        parameters
        targets {
          namespace {
            name
            path
            cluster {
              name
            }
          }
          ref
          parameters
        }
      }
    }
  }
}`;

// const checkoutCommand = `git archive --remote=${chromeDeploymentConfig.repo}  HEAD ${chromeDeploymentConfig.deployFile} |  tar xvf - -C ${chromeDeploymentConfig.tarTarget}`;

function checkContainerRuntime(): ContainerRuntime {
  try {
    if (execSync('which podman').toString().trim().length > 0) {
      return 'podman';
    }
  } catch (_) {
    // Ignore!
  }

  try {
    if (execSync('which docker').toString().trim().length > 0) {
      return 'docker';
    }
  } catch (_) {
    // Ignore!
  }

  // Neither found!
  throw new Error('No container runtime found');
}

type ResourceTemplate = {
  name: string;
  targets: { ref: string; namespace: { path: string } }[];
};

async function getProdRelease() {
  try {
    const {
      data: { data },
    } = await axios.post<{
      data: {
        apps: {
          name: string;
          saasFiles: {
            resourceTemplates: ResourceTemplate[];
          }[];
        }[];
      };
    }>(GRAPHQL_ENDPOINT, {
      query: APPS_QUERY,
    });
    const base = data.apps.find(({ name }) => name.includes('frontend-base'));
    if (!base) {
      throw new Error('No frontend-base found!');
    }
    let i = 0;
    let chromeResourceTemplate: ResourceTemplate | undefined = undefined;
    while (!chromeResourceTemplate && i < base.saasFiles.length) {
      chromeResourceTemplate = base.saasFiles[i].resourceTemplates.find(({ name }) => name.includes('insights-chrome'));
      i += 1;
    }
    if (!chromeResourceTemplate) {
      throw new Error('No insights-chrome resource template found!');
    }

    const prodTarget = chromeResourceTemplate.targets.find(({ namespace: { path } }) => path.includes('prod-frontends'));

    if (!prodTarget) {
      throw new Error('Not chrome prod target deployment found!');
    }

    return prodTarget.ref.substring(0, 7);
  } catch (error) {
    fecLogger(LogType.error, error);
    fecLogger(LogType.warn, 'Unable to find chrome prod deployment! Falling back to latest image.');
    return Promise.resolve(LATEST_IMAGE_TAG);
  }
}

function pullImage(tag: string) {
  execSync(`${execBin} pull ${IMAGE_REPO}:${tag}`, {
    stdio: 'inherit',
  });
}

async function startServer(tag: string, serverPort: number) {
  return new Promise<void>((resolve, reject) => {
    try {
      execSync(`${execBin} stop ${CONTAINER_NAME}`, {
        stdio: 'inherit',
      });
      execSync(`${execBin} rm ${CONTAINER_NAME}`, {
        stdio: 'inherit',
      });
    } catch (error) {
      fecLogger(LogType.info, 'No existing chrome container found');
    }
    const runCommand = `${execBin} run -p ${serverPort}:${CONTAINER_PORT} --name ${CONTAINER_NAME} ${IMAGE_REPO}:${tag}`;
    const child = spawn(runCommand, [], {
      stdio: 'ignore',
      shell: true,
    });
    child.stderr?.on('data', (data) => {
      reject(data.toString());
    });
    child.on('exit', () => {
      return reject(`Chrome server stopped unexpectedly! The server port ${serverPort} is already in use!`);
    });
  });
}

function copyIndex(path: string) {
  try {
    fs.statSync(path);
  } catch (error) {
    // create dist directory if it doesn't exist
    fs.mkdirSync(path, { recursive: true });
  }
  const copyCommand = `${execBin} cp ${CONTAINER_NAME}:/opt/app-root/src/build/stable/index.html ${path}`;
  execSync(copyCommand, {
    stdio: 'inherit',
  });
}

async function serveChrome(distPath: string, host: string, onError: (error: Error) => void, isProd = false, serverPort = 9999) {
  if (!distPath) {
    throw new Error('No distPath provided! Provide an absolute path to the UI dist directory.');
  }
  fecLogger(LogType.info, 'Starting chrome server...');
  execBin = checkContainerRuntime();
  let tag: string;
  if (isProd) {
    tag = await getProdRelease();
  } else {
    tag = LATEST_IMAGE_TAG;
  }
  pullImage(tag);
  startServer(tag, serverPort).catch((error) => {
    onError(error);
    process.exit(1);
  });
  await waitOn({
    resources: [`http://${host}:${serverPort}`],
  });
  copyIndex(distPath);
}

export default serveChrome;
