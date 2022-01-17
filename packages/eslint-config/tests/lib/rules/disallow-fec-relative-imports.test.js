/* eslint-disable max-len */
let rule = require('../../../lib/rules/disallow-fec-relative-imports');
let RuleTester = require('eslint').RuleTester;

let ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2015, sourceType: 'module' } });
ruleTester.run('fec-direct-import', rule, {
  valid: [
    'import X from "@redhat-cloud-services/frontend-components/X"',
    'import { X } from "@redhat-cloud-services/frontend-components/X"',
    'import { X, Y, Z } from "@redhat-cloud-services/frontend-components/X"',
    'import A, { X, Y, Z } from "@redhat-cloud-services/frontend-components/X"',
    'const X = 2',
    'import { X } from "@somePackage/frontend-components"',
    'import "@redhat-cloud-services/frontend-components"',
    'const X = require("@redhat-cloud-services/frontend-components")',
    'import { Spinner } from "@redhat-cloud-services/frontend-components/Spinner";\nimport "./compliance.scss";',
  ],
  invalid: [
    {
      code: 'import "@redhat-cloud-services/frontend-components/foo/styles.css"\n//additional text that should stay\n//import X from "foo"',
      errors: [
        {
          message: `Avoid importing styles from @redhat-cloud-services/frontend-components/foo/styles.css. Styles are injected with components automatically.`,
        },
      ],
      output: '\n//additional text that should stay\n//import X from "foo"',
    },
    {
      code: 'import A from "@redhat-cloud-services/frontend-components/A"\nimport X, { Y } from "@redhat-cloud-services/frontend-components"\nimport { B } from "@redhat-cloud-services/frontend-components/B"',
      errors: [
        {
          message: `Avoid using relative imports from @redhat-cloud-services/frontend-components. Use direct import path to X. Module may be found at import X from '@redhat-cloud-services/frontend-components/X'.`,
        },
      ],
      output:
        'import A from "@redhat-cloud-services/frontend-components/A"\nimport X from "@redhat-cloud-services/frontend-components/X"\nimport Y from "@redhat-cloud-services/frontend-components/Y"\nimport { B } from "@redhat-cloud-services/frontend-components/B"',
    },
    {
      code: 'import { X } from "@redhat-cloud-services/frontend-components"',
      errors: [
        {
          message: `Avoid using relative imports from @redhat-cloud-services/frontend-components. Use direct import path to X. Module may be found at import X from '@redhat-cloud-services/frontend-components/X'.`,
        },
      ],
      output: 'import X from "@redhat-cloud-services/frontend-components/X"',
    },
    {
      code: 'import { X, Y } from "@redhat-cloud-services/frontend-components"',
      errors: [
        {
          message: `Avoid using relative imports from @redhat-cloud-services/frontend-components. Use direct import path to X. Module may be found at import X from '@redhat-cloud-services/frontend-components/X'.`,
        },
      ],
      output: 'import X from "@redhat-cloud-services/frontend-components/X"\nimport Y from "@redhat-cloud-services/frontend-components/Y"',
    },
  ],
});
