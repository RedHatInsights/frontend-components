import path from 'path';
import glob from 'glob';
import fs from 'fs';
import chalk from 'chalk';

const checkPfVersion = (version: string) => {
  const number = version.replace(/[^0-9]/g, '');
  try {
    const versionInt = Number(number);
    return versionInt >= 500;
  } catch (error) {
    console.log(chalk.yellow(`Unable to parse PF package version: ${version}.`));
    return false;
  }
};

const getDynamicModules = (root: string) => {
  if (!root) {
    throw new Error('Provide a directory of your node_modules to find dynamic modules');
  }

  const packageFile = fs.readFileSync(path.resolve(root, 'package.json'), { encoding: 'utf-8' });
  const packageJSON = JSON.parse(packageFile);
  const coreVersion = packageJSON.dependencies['@patternfly/react-core'] || packageJSON.devDependencies['@patternfly/react-core'];
  const iconsVersion = packageJSON.dependencies['@patternfly/react-icons'] || packageJSON.devDependencies['@patternfly/react-icons'];

  const coreValid = checkPfVersion(coreVersion);
  const iconsValid = checkPfVersion(iconsVersion);
  if (!coreValid) {
    console.log(chalk.yellow('[fec]'), `Unsupported @patternfly packages version. Dynamic modules require version ^5.0.0. Got ${coreVersion}.`);
    return {};
  }
  if (!iconsValid) {
    console.log(chalk.yellow('[fec]'), `Unsupported @patternfly packages version. Dynamic modules require version ^5.0.0. Got ${iconsVersion}.`);
    return {};
  }

  const componentsGlob = path.resolve(root, 'node_modules/@patternfly/react-core/dist/dynamic/*/**/package.json');
  const iconsGlob = path.resolve(root, 'node_modules/@patternfly/react-icons/dist/dynamic/*/**/package.json');

  const files = [
    { requiredVersion: coreVersion, files: glob.sync(componentsGlob) },
    { requiredVersion: iconsVersion, files: glob.sync(iconsGlob) },
  ];
  const modules = files
    .map(({ files, requiredVersion }) =>
      files.reduce((acc, curr) => {
        const moduleName = curr
          .replace(/\/package.json$/, '')
          .split('/node_modules/')
          .pop();
        if (!moduleName) {
          throw new Error(`Unable to get module name from: ${curr}`);
        }
        return {
          ...acc,
          [moduleName]: {
            requiredVersion,
          },
        };
      }, {})
    )
    .reduce(
      (acc, curr) => ({
        ...acc,
        ...curr,
      }),
      {}
    );

  return modules;
};

export default getDynamicModules;
