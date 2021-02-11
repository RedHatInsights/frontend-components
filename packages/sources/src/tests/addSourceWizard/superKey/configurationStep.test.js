import React from 'react';
import { Label } from '@patternfly/react-core';

import componentTypes from '@data-driven-forms/react-form-renderer/dist/esm/component-types';
import sourceTypes from '../../helpers/sourceTypes';
import configurationStep from '../../../addSourceWizard/superKey/configurationStep';
import SuperKeyCredentials from '../../../addSourceWizard/superKey/SuperKeyCredentials';

describe('configurationSteps', () => {
    it('generates configuration step', () => {
        const INTL = { formatMessage: ({ defaultMessage }) => defaultMessage };

        const result = configurationStep(INTL, sourceTypes);

        expect(result.name).toEqual('configuration_step');
        expect(result.title).toEqual('Select configuration');

        expect(result.nextStep({ values: {} })).toEqual(undefined);
        expect(result.nextStep({ values: { source: { app_creation_workflow: 'account_authorization' } } })).toEqual('select_applications');
        expect(result.nextStep({ values: { source: { app_creation_workflow: 'manual_configuration' } } })).toEqual('application_step');

        expect(result.fields).toHaveLength(4);

        expect(result.fields[0].component).toEqual(componentTypes.PLAIN_TEXT);
        expect(result.fields[0].label).toEqual('Configure your source manually or let us manage all necessary credentials by selecting Superkey configuration.');

        expect(result.fields[1].component).toEqual(componentTypes.RADIO);
        expect(result.fields[1].label).toEqual('Select a configuration mode');
        expect(result.fields[1].options).toEqual(
            [{
                description: 'A new automated source configuration method. Provide your AWS account credentials and let Red Hat configure and manage your source for you.',
                label: <span className="ins-c-sources__wizard--rhel-mag-label">Account authorization<Label className="pf-u-ml-sm" color="purple">Recommended</Label></span>,
                value: 'account_authorization'
            }]
        );

        expect(result.fields[2].component).toEqual(componentTypes.SUB_FORM);
        expect(result.fields[2].condition).toEqual({ is: 'account_authorization', when: 'source.app_creation_workflow' });

        expect(result.fields[2].fields[0].Content).toEqual(SuperKeyCredentials);
        expect(result.fields[2].fields[0].component).toEqual('description');
        expect(result.fields[2].fields[0].sourceTypes).toEqual(sourceTypes);

        expect(result.fields[3].component).toEqual(componentTypes.RADIO);
        expect(result.fields[3].label).toEqual(undefined);
        expect(result.fields[3].options).toEqual(
            [{
                description:
                'Configure and manage your source manually if you do not wish to provide Superkey credentials. You will set up sources the same way you do today.',
                label: 'Manual configuration',
                value: 'manual_configuration'
            }]
        );
    });
});
