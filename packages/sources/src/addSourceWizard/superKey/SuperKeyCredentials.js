import PropTypes from 'prop-types';

import useFormApi from '@data-driven-forms/react-form-renderer/dist/esm/use-form-api';
import generateSuperKeyFields from './generateSuperKeyFields';

const SuperKeyCredentials = ({ sourceTypes }) => {
    const { renderForm, getState } = useFormApi();

    const values = getState().values;

    return renderForm(generateSuperKeyFields(sourceTypes, values.source_type));
};

SuperKeyCredentials.propTypes = {
    sourceTypes: PropTypes.array
};

export default SuperKeyCredentials;
