import Ajv from 'ajv/dist/2020';
import { load } from 'js-yaml';
import fs from 'fs';
import { FrontendCRD } from './feo-types';
import chalk from 'chalk';
// CRD does not have a type and does not need one
// @ts-ignore
import frontendCrdSchema from './spec/frontend-crd.schema.json';
import fecLogger, { LogType } from '../fec-logger';

function readCrdYaml(pathToCrd: string): FrontendCRD {
  const data = fs.readFileSync(pathToCrd, 'utf8');
  return load(data) as FrontendCRD;
}

function validateFrontendCrd(pathToCrd: string): void;
function validateFrontendCrd(crd: FrontendCRD): void;
function validateFrontendCrd(crd: FrontendCRD | string) {
  const validator = new Ajv({
    strict: true,
  });
  const crdInternal = typeof crd === 'string' ? readCrdYaml(crd) : crd;
  // Remove $schema from the json as this is unknown to ajv
  // @ts-ignore
  delete frontendCrdSchema.$schema;
  const validate = validator.compile(frontendCrdSchema);
  const valid = validate(crdInternal);
  if (!valid) {
    validate.errors?.forEach((error) => {
      console.group();
      console.log(chalk.red`
Frontend CRD validation error:
  - ${error.message}
    ${error.instancePath}
    ${error.keyword}
    ${JSON.stringify(error.params)}`);
      console.groupEnd();
    });
    const errorMessages = validate.errors?.map((error) => error.message).join(', ');
    throw new Error(`Frontend CRD validation failed! ${errorMessages?.length ?? 0 > 0 ? errorMessages : 'Unable to validate frontend CRD'}`);
  }
}

export default validateFrontendCrd;
