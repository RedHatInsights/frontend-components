import PropTypes from 'prop-types';

import useFormApi from '@data-driven-forms/react-form-renderer/dist/esm/use-form-api';
import { getAdditionalAuthFields, getAdditionalStepKeys, getNoStepsFields, injectAuthFieldsInfo } from '../schemaBuilder';

const SuperKeyCredentials = ({ sourceTypes }) => {
    const { renderForm, getState } = useFormApi();

    const values = getState().values;

    const authype = sourceTypes
    .find(({ name }) => name === values.source_type)?.schema.authentication
    .find(({ is_super_key, type }) => is_super_key || type === 'access_key_secret_key');

    const additionalIncludesStepKeys = getAdditionalStepKeys(values.source_type, authype.type);

    const fields = [
        ...getAdditionalAuthFields(values.source_type, authype.type),
        ...injectAuthFieldsInfo(getNoStepsFields(authype.fields, additionalIncludesStepKeys), values.source_type, authype.type)
    ];

    return renderForm(fields);
};

SuperKeyCredentials.propTypes = {
    sourceTypes: PropTypes.array
};

export default SuperKeyCredentials;
