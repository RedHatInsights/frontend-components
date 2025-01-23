import { readFileSync } from 'fs';
import { load } from 'js-yaml';
import { FrontendCRD } from './feo-types';
import validateFrontendCrd from './validate-frontend-crd';
import fecLogger, { LogType } from '../fec-logger';

export function readFrontendCRD(crdPath: string): FrontendCRD {
  try {
    const file = readFileSync(crdPath, 'utf8');
    const crd = load(file) as FrontendCRD;
    try {
      validateFrontendCrd(crd);
    } catch (error) {
      // log only warning for dev server
      fecLogger(LogType.warn, error);
    }
    return crd;
  } catch (error) {
    throw new Error(`Error reading frontend CRD at ${crdPath}: ${error}`);
  }
}

export function hasFEOFeaturesEnabled(crd: FrontendCRD): boolean {
  return crd.objects?.[0].spec.feoConfigEnabled || false;
}
