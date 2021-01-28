import React from 'react';

import FormRenderer from '@data-driven-forms/react-form-renderer/dist/cjs/form-renderer';
import componentTypes from '@data-driven-forms/react-form-renderer/dist/cjs/component-types';
import validatorTypes from '@data-driven-forms/react-form-renderer/dist/cjs/validator-types';
import validatorMapper from '@data-driven-forms/react-form-renderer/dist/cjs/validator-mapper';

import FormTemplate from '@data-driven-forms/pf4-component-mapper/dist/cjs/form-template';
import componentMapper from '@data-driven-forms/pf4-component-mapper/dist/cjs/component-mapper';

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
