import { getAdditionalAuthFields, getAdditionalStepKeys, getNoStepsFields, injectAuthFieldsInfo } from '../schemaBuilder';

const generateSuperKeyFields = (sourceTypes, source_type) => {
    const authype = sourceTypes
    .find(({ name }) => name === source_type)?.schema.authentication
    .find(({ is_super_key, type }) => is_super_key || type === 'access_key_secret_key');

    const additionalIncludesStepKeys = getAdditionalStepKeys(source_type, authype.type);

    const fields = [
        ...getAdditionalAuthFields(source_type, authype.type),
        ...injectAuthFieldsInfo(getNoStepsFields(authype.fields, additionalIncludesStepKeys), source_type, authype.type)
    ];

    return fields;
};

export default generateSuperKeyFields;
