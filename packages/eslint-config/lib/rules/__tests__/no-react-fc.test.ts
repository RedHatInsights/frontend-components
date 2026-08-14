/* eslint-disable @typescript-eslint/no-require-imports */
const { Linter } = require('eslint');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');

const RULE_ID = '@typescript-eslint/no-restricted-types';

function lintCode(code: string) {
  const linter = new Linter();
  return linter
    .verify(code, {
      plugins: { '@typescript-eslint': tsPlugin },
      languageOptions: {
        parser: tsParser,
        parserOptions: { ecmaVersion: 2020, sourceType: 'module', ecmaFeatures: { jsx: true } },
      },
      rules: {
        [RULE_ID]: [
          'error',
          {
            types: {
              FC: { message: 'banned' },
              'React.FC': { message: 'banned' },
              FunctionComponent: { message: 'banned' },
              'React.FunctionComponent': { message: 'banned' },
            },
          },
        ],
      },
    })
    .filter((m: { ruleId: string }) => m.ruleId === RULE_ID);
}

describe('no-restricted-types bans React.FC patterns', () => {
  it('catches React.FC (qualified)', () => {
    const errors = lintCode(`
      import React from 'react';
      const Comp: React.FC = () => null;
    `);
    expect(errors).toHaveLength(1);
    expect(errors[0].message).toContain('React.FC');
  });

  it('catches FC (direct import)', () => {
    const errors = lintCode(`
      import { FC } from 'react';
      const Comp: FC = () => null;
    `);
    expect(errors).toHaveLength(1);
    expect(errors[0].message).toContain('FC');
  });

  it('catches React.FunctionComponent (qualified)', () => {
    const errors = lintCode(`
      import React from 'react';
      const Comp: React.FunctionComponent = () => null;
    `);
    expect(errors).toHaveLength(1);
    expect(errors[0].message).toContain('React.FunctionComponent');
  });

  it('catches FunctionComponent (direct import)', () => {
    const errors = lintCode(`
      import { FunctionComponent } from 'react';
      const Comp: FunctionComponent = () => null;
    `);
    expect(errors).toHaveLength(1);
    expect(errors[0].message).toContain('FunctionComponent');
  });

  it('catches React.FC with generic props', () => {
    const errors = lintCode(`
      import React from 'react';
      interface Props { name: string }
      const Comp: React.FC<Props> = ({ name }) => null;
    `);
    expect(errors).toHaveLength(1);
  });

  it('allows inline props typing', () => {
    const errors = lintCode(`
      interface Props { name: string }
      const Comp = (props: Props) => null;
    `);
    expect(errors).toHaveLength(0);
  });

  it('allows function declaration components', () => {
    const errors = lintCode(`
      interface Props { name: string }
      function Comp(props: Props) { return null; }
    `);
    expect(errors).toHaveLength(0);
  });
});
