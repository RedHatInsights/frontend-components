/* eslint-disable camelcase */
export const remediationsWizardTestData = {

    issues: [
        {
            id: 'testId',
            description: 'description'
        }
    ],
    systems: [ 'system' ],
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
    }
};
