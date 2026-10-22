import Ajv, { ErrorObject } from 'ajv/dist/2020';
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

/**
 * Clearer messages for the Frontend `spec.locales` rules. The schema mirrors the
 * validation in api/v1alpha1/locale_types.go of RedHatInsights/frontend-operator,
 * which is the source of truth: keep these messages in sync with the operator's
 * XValidation messages. Ajv's defaults ("must match pattern ...", "must NOT be
 * valid") do not say what is wrong or which entry is at fault.
 */
const LOCALE_ID_RULE = /\/locales\/propertyNames\/(pattern|maxLength|not)$/;
const MESSAGE_KEY_RULE = /\/locales\/additionalProperties\/propertyNames\/(pattern|maxLength)$/;
const LOCALE_PROPERTY_NAMES = /\/locales(\/additionalProperties)?\/propertyNames$/;

function describePropertyNameError(error: ErrorObject): string | undefined {
  const where = error.instancePath;
  const { propertyName } = error;
  if (LOCALE_ID_RULE.test(error.schemaPath)) {
    if (error.keyword === 'not') {
      return `${where}: locale "${propertyName}": English is the source language and must not be listed as a translation`;
    }
    if (error.keyword === 'maxLength') {
      return `${where}: locale "${propertyName}": locale identifiers must be at most ${error.params.limit} characters`;
    }
    return `${where}: locale "${propertyName}": locale identifiers must use canonical BCP 47 casing, e.g. fr, ko, ja, zh-CN, zh-Hant-TW`;
  }
  if (MESSAGE_KEY_RULE.test(error.schemaPath)) {
    if (error.keyword === 'maxLength') {
      return `${where}: message key "${propertyName}": message keys must be at most ${error.params.limit} characters`;
    }
    return `${where}: message key "${propertyName}": message keys must be dot-separated paths of letters, digits, '_' and '-' (e.g. searchEntries.rbac-roles.title)`;
  }
  return undefined;
}

function describeLocaleError(error: ErrorObject): string | undefined {
  const where = error.instancePath;
  if (error.schemaPath.endsWith('/locales/maxProperties')) {
    return `${where}: at most ${error.params.limit} locales may be listed`;
  }
  if (error.schemaPath.endsWith('/locales/additionalProperties/maxProperties')) {
    return `${where}: at most ${error.params.limit} message keys may be listed per locale`;
  }
  if (error.schemaPath.endsWith('/locales/additionalProperties/additionalProperties/maxLength')) {
    return `${where}: message values must be at most ${error.params.limit} characters`;
  }
  if (error.schemaPath.endsWith('/locales/additionalProperties/additionalProperties/type')) {
    return `${where}: message values must be strings`;
  }
  return undefined;
}

/**
 * Ajv reports a failing property name as the failed keyword (pattern, maxLength, not),
 * which carries the offending name in `propertyName`, followed by a generic
 * `propertyNames` error. Every locale property-name rule is described above, so the
 * generic locale `propertyNames` errors are dropped.
 */
function improveLocaleErrors(errors: ErrorObject[]): ErrorObject[] {
  return errors
    .filter((error) => !(error.keyword === 'propertyNames' && LOCALE_PROPERTY_NAMES.test(error.schemaPath)))
    .map((error) => {
      const message = error.propertyName === undefined ? describeLocaleError(error) : describePropertyNameError(error);
      return { ...error, message: message ?? error.message };
    });
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
    const errors = improveLocaleErrors(validate.errors ?? []);
    errors.forEach((error) => {
      console.group();
      console.log(chalk.red`
Frontend CRD validation error:
  - ${error.message}
    ${error.instancePath}
    ${error.keyword}
    ${JSON.stringify(error.params)}`);
      console.groupEnd();
    });
    const errorMessages = errors.map((error) => error.message).join(', ');
    throw new Error(`Frontend CRD validation failed! ${errorMessages.length > 0 ? errorMessages : 'Unable to validate frontend CRD'}`);
  }
}

export default validateFrontendCrd;
