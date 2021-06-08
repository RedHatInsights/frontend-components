import schemaBuilder, {
    issueResolutionNextStep,
    reviewActionsNextStep,
    reviewSystemsNextStep
} from '../RemediationWizard/schema';
import {
    EXISTING_PLAYBOOK,
    MANUAL_RESOLUTION,
    EXISTING_PLAYBOOK_SELECTED,
    ISSUES_MULTIPLE,
    SYSTEMS
} from '../utils';
import { remediationWizardTestData } from './testData';

describe('reviewActionsNextStep', () => {

    let formValues;

    beforeEach(() => {
        formValues = {
            ...remediationWizardTestData.formValues,
            [EXISTING_PLAYBOOK]: {
                issues: [{
                    id: 'anotherId',
                    resolution: { id: 'test2' }
                }]
            },
            [SYSTEMS]: remediationWizardTestData.selectedSystems
        };
    });

    it('should return review on auto resolution', () => {
        const value = reviewActionsNextStep(formValues, []);
        expect(value).toEqual('review');
    });

    it('should return step on manual resolution', () => {
        const value = reviewActionsNextStep({
            ...formValues,
            [MANUAL_RESOLUTION]: true,
            [EXISTING_PLAYBOOK_SELECTED]: true,
            [SYSTEMS]: remediationWizardTestData.selectedSystems
        }, [{ id: 'testId' }]);
        expect(value).toEqual('testId');
    });
});

describe('issueResolutionNextStep', () => {

    let formValues;

    beforeEach(() => {
        formValues = {
            [EXISTING_PLAYBOOK]: {
                issues: [{
                    id: 'testId2',
                    resolution: { id: 'test' }
                }]
            },
            [ISSUES_MULTIPLE]: [{ id: 'test' }],
            [SYSTEMS]: remediationWizardTestData.selectedSystems
        };
    });

    it('should return review on no issues', () => {
        const value = issueResolutionNextStep(formValues, undefined);
        expect(value).toEqual('review');
    });

    it('should return step on next issue', () => {
        const value = issueResolutionNextStep({
            ...formValues,
            [MANUAL_RESOLUTION]: true,
            [EXISTING_PLAYBOOK_SELECTED]: true,
            [ISSUES_MULTIPLE]: [{ id: 'testId' }, { id: 'testId2' }, { id: 'testId3' }]
        }, { id: 'testId' });
        expect(value).toEqual('testId3');
    });
});

describe('reviewSystemsNextStep', () => {

    let formValues;

    beforeEach(() => {
        formValues = {
            [EXISTING_PLAYBOOK]: {
                issues: [{
                    id: 'testId2',
                    resolution: { id: 'test' }
                }]
            },
            [ISSUES_MULTIPLE]: [{ id: 'test' }],
            [SYSTEMS]: remediationWizardTestData.selectedSystems
        };
    });

    it('should return review on no issues', () => {
        const value = reviewSystemsNextStep(formValues, undefined);
        expect(value).toEqual('review');
    });

    it('should return actions on next issue', () => {
        const value = reviewSystemsNextStep({
            ...formValues,
            [MANUAL_RESOLUTION]: true,
            [EXISTING_PLAYBOOK_SELECTED]: true,
            [ISSUES_MULTIPLE]: [{ id: 'testId' }]
        });
        expect(value).toEqual('actions');
    });
});

describe('schema', () => {

    const formValues = {
        ...remediationWizardTestData.formValues,
        [SYSTEMS]: remediationWizardTestData.selectedSystems
    };

    it('should render issues', () => {
        const schema = schemaBuilder(remediationWizardTestData.issues);
        expect(schema.fields[0].fields[1].nextStep({ values: formValues })).toEqual('actions');
        expect(schema.fields[0].fields[2].name).toEqual('actions');
        expect(schema.fields[0].fields[2].nextStep({ values: formValues })).toEqual('review');
    });

});
