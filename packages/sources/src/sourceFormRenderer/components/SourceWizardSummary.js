import React from 'react';
import PropTypes from 'prop-types';
import { TextContent, TextListItem, TextListItemVariants, TextListVariants, TextList } from '@patternfly/react-core';
import get from 'lodash/get';
import hardcodedSchemas from '../../addSourceWizard/hardcodedSchemas';
import { injectAuthFieldsInfo, injectEndpointFieldsInfo, getAdditionalSteps } from '../../addSourceWizard/schemaBuilder';
import ValuePopover from './ValuePopover';

export const createItem = (formField, values, stepKeys) => {
    let value = get(values, formField.name);

    if (formField.stepKey && !stepKeys.includes(formField.stepKey)) {
        return undefined;
    }

    if (formField.condition && get(values, formField.condition.when) !== formField.condition.is) {
        return undefined;
    }

    // do not show hidden fields
    if (formField.hideField) {
        return undefined;
    }

    // Hide password
    if (value && formField.type === 'password') {
        value = '●●●●●●●●●●●●';
    }

    // Boolean value convert to Yes / No
    if (typeof value === 'boolean') {
        value = value ? 'Yes' : 'No';
    }

    if (!value && formField.name === 'authentication.password' && get(values, 'authentication.id')) {
        value = '●●●●●●●●●●●●';
    }

    return ({ label: formField['aria-label'] || formField.label,  value: value || '-' });
};

export const getAllFieldsValues = (fields, values, stepKeys) => fields.map((field) => createItem(field, values, stepKeys)).filter(Boolean);

export const getStepKeys = (typeName, authName, appName = 'generic', appId) => [
    ...get(hardcodedSchemas, [ typeName, 'authentication', authName, appName, 'includeStepKeyFields' ], []),
    ...get(hardcodedSchemas, [ typeName, 'authentication', authName, appName, 'additionalSteps' ], []).map(({ stepKey }) => stepKey),
    `${typeName}-${authName}-${appName}-additional-step`,
    `${typeName}-${authName}-additional-step`,
    appId ? `${typeName}-${appId}` : undefined
].filter(Boolean);

const SourceWizardSummary = ({ sourceTypes, formOptions, applicationTypes, showApp, showAuthType }) => {
    const values = formOptions.getState().values;
    const type = sourceTypes.find(type => type.name === values.source_type || type.id === values.source.source_type_id);

    const hasAuthentication = values.authentication && values.authentication.authtype ? values.authentication.authtype : values.auth_select;

    let authType;
    let authTypeFields = [];

    if (hasAuthentication) {
        authType = type.schema.authentication.find(({ type }) => type === hasAuthentication);
        authTypeFields = authType && authType.fields ? authType.fields : [];
    }

    const skipEndpoint = values.noEndpoint;

    let endpointFields = type.schema.endpoint.fields;

    if (skipEndpoint) {
        endpointFields = [];
        authTypeFields = authTypeFields.filter(({ name }) => !name.includes('authentication.'));
    }

    const application = values.application ? applicationTypes.find(type => type.id === values.application.application_type_id) : undefined;

    const { display_name = 'Not selected', name, id } = application ? application : {};

    const availableStepKeys = getStepKeys(type.name, hasAuthentication, name, id);

    const authSteps = getAdditionalSteps(type.name, hasAuthentication, name);
    const hasCustomSteps = get(hardcodedSchemas, [ type.name, 'authentication', hasAuthentication, name, 'customSteps' ], false);

    if (authSteps.length > 0) {
        authTypeFields = authSteps
        .map((step) => [ ...step.fields, ...authTypeFields.filter(({ stepKey }) => stepKey && step.stepKey === stepKey) ])
        .flatMap(x => x)
        .filter(({ name }) => (
            authTypeFields.find((field) => field.name === name) ||
            (hasCustomSteps && endpointFields.find((field) => field.name === name))
        ));
    }

    if (hasCustomSteps) {
        endpointFields = [];
    }

    authTypeFields = injectAuthFieldsInfo(authTypeFields, type.name, hasAuthentication, name || 'generic');
    endpointFields = injectEndpointFieldsInfo(endpointFields, type.name);

    const fields = [ ...authTypeFields, ...endpointFields ];

    const valuesInfo = getAllFieldsValues(fields, values, availableStepKeys);

    const valuesList = valuesInfo.map(({ label, value }) => (
        <React.Fragment key={ `${label}--${value}` }>
            <TextListItem component={ TextListItemVariants.dt }>{ label }</TextListItem>
            <TextListItem component={ TextListItemVariants.dd }>
                { value.toString().length > 150 ?
                    <ValuePopover label={label} value={value} />
                    :
                    value
                }
            </TextListItem>
        </React.Fragment>
    ));

    return (
        <TextContent>
            <TextList component={ TextListVariants.dl }>
                <TextListItem component={ TextListItemVariants.dt }>{ 'Name' }</TextListItem>
                <TextListItem component={ TextListItemVariants.dd }>{ values.source.name }</TextListItem>
                { showApp && <React.Fragment>
                    <TextListItem component={ TextListItemVariants.dt }>{ 'Application' }</TextListItem>
                    <TextListItem component={ TextListItemVariants.dd }>{ display_name }</TextListItem>
                </React.Fragment> }
                <TextListItem component={ TextListItemVariants.dt }>{ 'Source type' }</TextListItem>
                <TextListItem component={ TextListItemVariants.dd }>{ type.product_name }</TextListItem>
                { !skipEndpoint && authType && showAuthType && <React.Fragment>
                    <TextListItem component={ TextListItemVariants.dt }>{ 'Authentication type' }</TextListItem>
                    <TextListItem component={ TextListItemVariants.dd }>{ authType.name }</TextListItem>
                </React.Fragment> }
                { valuesList }
            </TextList>
        </TextContent>
    );
};

SourceWizardSummary.propTypes = {
    formOptions: PropTypes.any.isRequired,
    sourceTypes: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        product_name: PropTypes.string.isRequired,
        schema: PropTypes.shape({
            authentication: PropTypes.array,
            endpoint: PropTypes.object
        })
    })).isRequired,
    applicationTypes: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        display_name: PropTypes.string.isRequired
    })).isRequired,
    showApp: PropTypes.bool,
    showAuthType: PropTypes.bool
};

SourceWizardSummary.defaultProps = {
    showApp: true,
    showAuthType: true
};

export default SourceWizardSummary;
