import React from 'react';

import FormRenderer from '@data-driven-forms/react-form-renderer';
import { layoutMapper, formFieldsMapper } from '@data-driven-forms/pf4-component-mapper';

import SourceWizardSummary from './components/SourceWizardSummary';
import Description from './components/Description';
import CardSelect from './components/CardSelect';
import AuthSelect from './components/AuthSelect';

export const mapperExtension = {
    summary: SourceWizardSummary,
    'card-select': CardSelect,
    'auth-select': AuthSelect
};

const SourcesFormRenderer = props => (
    <FormRenderer
        layoutMapper={ layoutMapper }
        formFieldsMapper={ {
            ...formFieldsMapper,
            ...mapperExtension,
            description: Description
        } }
        subscription={ { values: true } }
        { ...props }
    />
);

export default SourcesFormRenderer;
