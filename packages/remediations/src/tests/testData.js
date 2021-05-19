/* eslint-disable camelcase */
import {
    MANUAL_RESOLUTION,
    SELECTED_RESOLUTIONS,
    EXISTING_PLAYBOOK_SELECTED,
    ISSUES_MULTIPLE,
    RESOLUTIONS
} from '../utils';

const resolutions = [{
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
}];

const issuesMultiple = [
    {
        id: 'testId',
        description: 'description'
    }
];

export const remediationWizardTestData = {

    issues: [
        {
            id: 'testId',
            description: 'description'
        }
    ],

    systems: [ 'system' ],

    selectedSystems: {
        testId: [ 'system' ],
        testId2: [ 'system' ]
    },

    issuesById: {
        testId: {
            id: 'testId',
            description: 'test_description'
        },
        testId2: {
            id: 'testId2',
            description: 'description'
        }
    },

    resolutions,

    issuesMultiple,

    issueResolutionsResponse: {
        resolutions,
        errors: []
    },

    existingPlaybook: {
        auto_reboot: true,
        id: 'id',
        issues: [{
            id: 'test',
            systems: [{ id: 'test2', display_name: 'test2' }]
        }, {
            id: 'test3',
            systems: [{ id: 'test2', display_name: 'test2' }]
        }],
        name: 'test',
        needs_reboot: false
    },

    formValues: {
        [MANUAL_RESOLUTION]: false,
        [SELECTED_RESOLUTIONS]: [],
        [EXISTING_PLAYBOOK_SELECTED]: false,
        [ISSUES_MULTIPLE]: issuesMultiple,
        [RESOLUTIONS]: resolutions
    }
};
