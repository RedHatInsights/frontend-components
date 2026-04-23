import fs from 'fs';
import path from 'path';
import { parse, ParseError } from 'jsonc-parser';
import fecLogger, { LogType } from '@redhat-cloud-services/frontend-components-config-utilities/fec-logger';

type TsConfigJson = { extends?: string; compilerOptions?: { jsx?: string } };

export function checkTsConfig(cwd: string, logger = fecLogger): void {
  const tsConfigPath = path.resolve(cwd, 'tsconfig.json');
  if (!fs.existsSync(tsConfigPath)) {
    return; // will be created from template with correct settings
  }
  try {
    const content = fs.readFileSync(tsConfigPath, 'utf8');
    const errors: ParseError[] = [];
    const tsConfig = parse(content, errors, { allowTrailingComma: true }) as TsConfigJson;
    if (errors.length > 0) {
      logger(LogType.warn, 'Could not parse tsconfig.json — skipping JSX transform check.');
      return;
    }
    const jsx = tsConfig?.compilerOptions?.jsx;
    if (jsx === undefined && tsConfig?.extends) {
      logger(LogType.warn, 'Your tsconfig.json uses "extends" without a local "compilerOptions.jsx" setting.');
      logger(LogType.warn, 'Ensure the resolved config sets compilerOptions.jsx to "react-jsx".');
      return;
    }
    if (jsx !== 'react-jsx') {
      logger(LogType.warn, 'Your tsconfig.json has "jsx": "' + (jsx ?? '<not set>') + '".');
      logger(LogType.warn, 'React 19 requires "jsx": "react-jsx" to use the automatic JSX transform.');
      logger(
        LogType.warn,
        "Without it, react/jsx-runtime will not be used and React internals may conflict with chrome's React singleton."
      );
      logger(LogType.warn, 'Update compilerOptions.jsx to "react-jsx" in your tsconfig.json.');
    }
  } catch {
    logger(LogType.warn, 'Could not parse tsconfig.json — skipping JSX transform check.');
  }
}
