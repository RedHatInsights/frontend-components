/* eslint-disable camelcase */
import schemaBuilder, { issueResolutionNextStep, reviewActionsNextStep } from '../RemediationWizard/schema';
import {
    EXISTING_PLAYBOOK,
    MANUAL_RESOLUTION,
    EXISTING_PLAYBOOK_SELECTED
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
            }
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
            [EXISTING_PLAYBOOK_SELECTED]: true
        }, [{ id: 'testId' }]);
        expect(value).toEqual('testId');
    });
});

describe('issueResolutionNextStep', () => {

    let formValues;

    beforeEach(() => {
        formValues = {
            ...formValues,
            [EXISTING_PLAYBOOK]: {
                issues: [{
                    id: 'testId2',
                    resolution: { id: 'test' }
                }]
            }
        };
    });

    it('should return review on no issues', () => {
        const value = issueResolutionNextStep(formValues, [], undefined);
        expect(value).toEqual('review');
    });

    it('should return step on next issue', () => {
        const value = issueResolutionNextStep({
            ...formValues,
            [MANUAL_RESOLUTION]: true,
            [EXISTING_PLAYBOOK_SELECTED]: true
        }, [{ id: 'testId' }, { id: 'testId2' }, { id: 'testId3' }], { id: 'testId' });
        expect(value).toEqual('testId3');
    });
});

describe('schema', () => {

    const formValues = remediationWizardTestData.formValues;
    const issuesMultiple = remediationWizardTestData.issuesMultiple;

    it('should render issues', () => {
        const schema = schemaBuilder(issuesMultiple);
        expect(schema.fields[0].fields[1].nextStep({ values: formValues })).toEqual('review');
        expect(schema.fields[0].fields[2].name).toEqual('actions');
        expect(schema.fields[0].fields[2].nextStep({ values: formValues })).toEqual('review');
    });

});
