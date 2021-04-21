import * as api from '../../api';
import { FETCH_RESOLUTIONS } from '../action-types';
import transform from 'lodash/transform';

const batchResolutions = async (issues) => {
    try {
        const result = await api.getResolutionsBatch(issues.map(i => i.id));

        const [ resolutions, warnings ] = transform(result, ([ resolutions, errors ], value, key) => {
            if (!value) {
                errors.push(`Issue ${key} does not have Ansible support`);
            } else {
                resolutions.push(value);
            }

            return [ resolutions, errors ];
        }, [ [], [] ]);

        return { resolutions, warnings };
    } catch (e) {
        return { errors: [ 'Error obtaining resolution information. Please try again later.' ] };
    }
};

export const fetchResolutions = (issues = []) => ({
    type: FETCH_RESOLUTIONS,
    payload: batchResolutions(issues)
});
