import React from 'react';

import FormRenderer from '@data-driven-forms/react-form-renderer';
import { layoutMapper, formFieldsMapper } from '@data-driven-forms/pf4-component-mapper';

import SourceWizardSummary from './components/SourceWizardSummary';
import Description from './components/Description';

const SourcesFormRenderer = props => (
    <FormRenderer
        layoutMapper={ layoutMapper }
        formFieldsMapper={ {
            ...formFieldsMapper,
            summary: SourceWizardSummary,
            description: Description
        } }
        { ...props } />
);

export default SourcesFormRenderer;
