/* eslint-disable camelcase */
import {
    MANUAL_RESOLUTION,
    SELECTED_RESOLUTIONS,
    EXISTING_PLAYBOOK_SELECTED
} from '../utils';

export const remediationWizardTestData = {

    issues: [
        {
            id: 'testId',
            description: 'description'
        }
    ],

    systems: [ 'system' ],

    issuesById: {
        testId: {
            id: 'testId',
            description: 'test_description'
        },
        testId2: {
            id: 'testId',
            description: 'description'
        }
    },

    issuesMultiple: [
        {
            id: 'testId',
            description: 'description'
        }
    ],

    resolutions: [{
        id: 'testId',
        resolution_risk: 3,
        resolutions: [{
            description: 'test',
            id: 'test1',
            needs_reboot: true,
            resolution_risk: 3
        },
        {
            description: 'test',
            id: 'test2',
            needs_reboot: true,
            resolution_risk: 3
        }]
    }],

    issueResolutionsResponse: {
        testId: {
            id: 'testId',
            resolution_risk: 3,
            resolutions: [{
                description: 'description',
                id: 'resolution-id',
                needs_reboot: true,
                resolution_risk: 3
            }]
        }
    },

    formValues: {
        [MANUAL_RESOLUTION]: false,
        [SELECTED_RESOLUTIONS]: [],
        [EXISTING_PLAYBOOK_SELECTED]: false
    }
};
