import React from 'react';
import componentTypes from '@data-driven-forms/react-form-renderer/dist/esm/component-types';
import validatorTypes from '@data-driven-forms/react-form-renderer/dist/esm/validator-types';
import { Label } from '@patternfly/react-core';
import SuperKeyCredentials from './SuperKeyCredentials';

const configurationStep = (intl, sourceTypes) => ({
    name: 'configuration_step',
    title: intl.formatMessage({
        id: 'wizard.configurationStep',
        defaultMessage: 'Select configuration'
    }),
    nextStep: ({ values }) => {
        if (!values.source?.is_super_key) {
            return;
        }

        return values.source?.is_super_key === 'true' ? 'select_applications' : 'application_step';
    },
    fields: [{
        component: componentTypes.PLAIN_TEXT,
        name: 'conf-desc',
        label: 'Configure your source manually or let us manage all necessary credentials by selecting Superkey configuration.'
    }, {
        component: componentTypes.RADIO,
        name: 'source.is_super_key',
        label: intl.formatMessage({
            id: 'wizard.configurationMode',
            defaultMessage: 'Select a configuration mode'
        }),
        isRequired: true,
        options: [{
            label: (<span className="ins-c-sources__wizard--rhel-mag-label">
                {intl.formatMessage({
                    id: 'wizard.accountAuth',
                    defaultMessage: 'Account authorization'
                })}
                <Label className="pf-u-ml-sm" color="purple">
                    {intl.formatMessage({ id: 'wizard.confMode.reccomended', defaultMessage: 'Recommended' })}
                </Label>
            </span>),
            description: intl.formatMessage({
                id: 'wizard.accountAuth.desc',
                defaultMessage:
                        'A new automated source configuration method. Provide your AWS account credentials and let Red Hat configure and manage your source for you.'
            }),
            value: 'true'
        }],
        validate: [{ type: validatorTypes.REQUIRED }]
    }, {
        component: componentTypes.SUB_FORM,
        name: 'sub-form',
        fields: [{
            component: 'description',
            name: 'super-key-credentials',
            Content: SuperKeyCredentials,
            sourceTypes
        }],
        condition: { when: 'source.is_super_key', is: 'true' },
        className: 'pf-u-ml-md'
    }, {
        component: componentTypes.RADIO,
        name: 'source.is_super_key',
        options: [{
            label: intl.formatMessage({
                id: 'wizard.manualAuth',
                defaultMessage: 'Manual configuration'
            }),
            description: intl.formatMessage({
                id: 'wizard.manualAuth.desc',
                defaultMessage:
                    'Configure and manage your source manually if you do not wish to provide Superkey credentials. You will set up sources the same way you do today.'
            }),
            value: 'false'
        }]
    }]
});

export default configurationStep;
