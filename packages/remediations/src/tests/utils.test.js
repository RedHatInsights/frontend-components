/* eslint-disable camelcase */
import * as dependency from '../api/index';
import {
    getResolution,
    submitRemediation,
    EXISTING_PLAYBOOK,
    MANUAL_RESOLUTION,
    SELECTED_RESOLUTIONS,
    EXISTING_PLAYBOOK_SELECTED
} from '../utils';
import { remediationWizardTestData } from './testData';

describe('getResolution', function () {

    let data;
    let resolutions;
    let formValues;

    beforeEach(() => {
        data = {
            issues: remediationWizardTestData.issues,
            systems: remediationWizardTestData.systems,
            onRemediationCreated: jest.fn()
        },
        resolutions = remediationWizardTestData.resolutions;
        formValues = {
            ...remediationWizardTestData.formValues,
            [EXISTING_PLAYBOOK]: {
                auto_reboot: true,
                id: 'id',
                issues: [{
                    id: 'test'
                }],
                name: 'test',
                needs_reboot: false
            },
            [EXISTING_PLAYBOOK_SELECTED]: true
        };
    });

    it('should return all when no values', () => {
        const value = getResolution('testId', formValues, resolutions);
        expect(value).toEqual(resolutions[0].resolutions);
    });

    it('should return selected resolution', () => {
        const value = getResolution('testId', {
            ...formValues,
            [MANUAL_RESOLUTION]: true,
            [SELECTED_RESOLUTIONS]: { testId: 'test1' }
        }, resolutions);
        expect(value).toEqual([
            resolutions[0].resolutions[0] ]);
    });

    it('should return existing resolution', () => {
        const value = getResolution('testId', {
            ...formValues,
            [EXISTING_PLAYBOOK]: {
                issues: [{
                    id: 'testId',
                    resolution: { id: 'test2' }
                }]
            }
        }, resolutions);
        expect(value).toEqual([
            resolutions[0].resolutions[1] ]);
    });

    it('should update remediation correctly', () => {
        const updateFunction = jest.fn(() => Promise.resolve());
        dependency.patchRemediation = updateFunction;
        submitRemediation(formValues, data, undefined, resolutions);
        expect(updateFunction).toHaveBeenCalledTimes(1);
    });

    it('should create remediation correctly', () => {
        const createFunction = jest.fn(() => Promise.resolve({ id: 'tesdId' }));
        dependency.createRemediation = createFunction;
        submitRemediation({ ...formValues, [EXISTING_PLAYBOOK_SELECTED]: false }, data, undefined, resolutions);
        expect(createFunction).toHaveBeenCalledTimes(1);
    });
});
