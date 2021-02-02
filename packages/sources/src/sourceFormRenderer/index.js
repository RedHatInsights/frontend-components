import React from 'react';

import FormRenderer from '@data-driven-forms/react-form-renderer/dist/esm/form-renderer';
import componentTypes from '@data-driven-forms/react-form-renderer/dist/esm/component-types';
import validatorTypes from '@data-driven-forms/react-form-renderer/dist/esm/validator-types';
import validatorMapper from '@data-driven-forms/react-form-renderer/dist/esm/validator-mapper';

import FormTemplate from '@data-driven-forms/pf4-component-mapper/dist/esm/form-template';
import componentMapper from '@data-driven-forms/pf4-component-mapper/dist/esm/component-mapper';

import SourceWizardSummary from './components/SourceWizardSummary';
import Description from './components/Description';
import CardSelect from './components/CardSelect';
import AuthSelect from './components/AuthSelect';
import Authentication from './components/Authentication';
import EnhancedRadio from './components/EnhancedRadio';

export const mapperExtension = {
    'auth-select': AuthSelect,
    description: Description,
    'card-select': CardSelect,
    summary: SourceWizardSummary,
    authentication: Authentication,
    'enhanced-radio': EnhancedRadio
};

const FormTemplateWrapper = (props) => <FormTemplate {...props} showFormControls={false}/>;

const SourcesFormRenderer = props => (
    <FormRenderer
        componentMapper={ {
            ...componentMapper,
            ...mapperExtension,
            'switch-field': componentMapper[componentTypes.SWITCH]
        } }
        validatorMapper={{
            'required-validator': validatorMapper[validatorTypes.REQUIRED],
            'pattern-validator': validatorMapper[validatorTypes.PATTERN],
            'min-length-validator': validatorMapper[validatorTypes.MIN_LENGTH],
            'url-validator': validatorMapper[validatorTypes.URL]
        }}
        FormTemplate={FormTemplateWrapper}
        subscription={ { values: true } }
        { ...props }
    />
);

export default SourcesFormRenderer;
