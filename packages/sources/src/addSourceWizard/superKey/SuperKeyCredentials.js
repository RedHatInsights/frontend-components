import PropTypes from 'prop-types';

import useFormApi from '@data-driven-forms/react-form-renderer/dist/esm/use-form-api';
import generateSuperKeyFields from './generateSuperKeyFields';

const SuperKeyCredentials = ({ sourceTypes }) => {
    const { renderForm, getState } = useFormApi();

    const values = getState().values;

    return renderForm(generateSuperKeyFields(values.source_type, sourceTypes));
};

SuperKeyCredentials.propTypes = {
    sourceTypes: PropTypes.array
};

export default SuperKeyCredentials;
