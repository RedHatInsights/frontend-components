/* eslint-disable camelcase */
import React from 'react';
import * as dependency from '../api/index';
import {
    entitySelected,
    getResolution,
    changeBulkSelect,
    loadEntitiesFulfilled,
    submitRemediation,
    EXISTING_PLAYBOOK,
    MANUAL_RESOLUTION,
    SELECTED_RESOLUTIONS,
    EXISTING_PLAYBOOK_SELECTED,
    fetchSystemsInfo,
    splitArray,
    getPlaybookSystems,
    createNotification
} from '../utils';
import { remediationWizardTestData } from './testData';

let data;
let resolutions;
let formValues;

const initialRows = [{ id: '123' }];

describe('getResolution', () => {

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
        const value = getResolution('testId', formValues);
        expect(value).toEqual(resolutions[0].resolutions);
    });

    it('should return selected resolution', () => {
        const value = getResolution('testId', {
            ...formValues,
            [MANUAL_RESOLUTION]: true,
            [SELECTED_RESOLUTIONS]: { testId: 'test1' }
        });
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
        });
        expect(value).toEqual([
            resolutions[0].resolutions[1] ]);
    });
});

describe('submitRemediation', () => {

    beforeEach(() => {
        data = {
            issues: remediationWizardTestData.issues,
            systems: remediationWizardTestData.systems,
            onRemediationCreated: jest.fn()
        },
        resolutions = remediationWizardTestData.resolutions;
        formValues = {
            ...remediationWizardTestData.formValues,
            [EXISTING_PLAYBOOK]: remediationWizardTestData.existingPlaybook,
            [EXISTING_PLAYBOOK_SELECTED]: true
        };
    });

    it('should update remediation correctly', () => {
        const updateFunction = jest.fn(() => Promise.resolve());
        dependency.patchRemediation = updateFunction;
        submitRemediation(formValues, data);
        expect(updateFunction).toHaveBeenCalledTimes(1);
    });

    it('should create remediation correctly', () => {
        const createFunction = jest.fn(() => Promise.resolve({ id: 'tesdId' }));
        dependency.createRemediation = createFunction;
        submitRemediation({ ...formValues, [EXISTING_PLAYBOOK_SELECTED]: false }, data, undefined);
        expect(createFunction).toHaveBeenCalledTimes(1);
    });

    it('should handle error', () => {
        const createFunction = jest.fn(() => Promise.reject('error'));
        dependency.createRemediation = createFunction;
        submitRemediation({ ...formValues, [EXISTING_PLAYBOOK_SELECTED]: false }, data, undefined, resolutions);
        expect(createFunction).toHaveBeenCalledTimes(1);
    });

});

describe('entitySelected', () => {

    it('should (un)select page correctly', () => {
        const selectValue = entitySelected({
            rows: initialRows
        }, {
            payload: { id: 0, selected: true }
        });
        const unselectValue = entitySelected({
            rows: initialRows,
            selected: [ '123' ]
        }, {
            payload: { id: 0, selected: false }
        });
        expect(selectValue).toEqual({ rows: initialRows, selected: [ '123' ] });
        expect(unselectValue).toEqual({ rows: initialRows, selected: [] });
    });

    it('should unselect all', () => {
        const value = entitySelected({
            rows: initialRows
        }, {
            payload: { id: -1, selected: false }
        });
        expect(value).toEqual({ rows: initialRows, selected: [] });
    });

    it('should unselect specific row', () => {
        const value = entitySelected({
            rows: initialRows,
            selected: [ '123', '456' ]
        }, {
            payload: { id: '123', selected: false }
        });
        expect(value).toEqual({ rows: initialRows, selected: [ '456' ] });
    });
});

describe('loadEntitiesFulfilled', () => {

    it('should select records on first load', () => {
        const valueAll = loadEntitiesFulfilled({
            rows: initialRows
        }, [ '123' ]);
        const valuePage = loadEntitiesFulfilled({
            rows: initialRows
        }, undefined);
        expect(valueAll).toEqual({ rows: [{ id: '123', selected: true }], selected: [ '123' ] });
        expect(valuePage).toEqual({ rows: [{ id: '123', selected: true }], selected: [ '123' ] });
    });

    it('should not select records on load after selection', () => {
        const value = loadEntitiesFulfilled({
            rows: initialRows,
            selected: [ '123' ]
        }, [ '123', '456' ]);
        expect(value).toEqual({ rows: [{ id: '123', selected: true }], selected: [ '123' ] });
    });
});

describe('changeBulkSelect', () => {

    it('should unselect on bulkSelect Toggle correctly', () => {
        const value = changeBulkSelect({
            rows: initialRows,
            selected: [ '123' ]
        }, {});
        expect(value).toEqual({ rows: [{ id: '123', selected: false }], selected: [] });
    });

    it('should select on bulkSelect Toggle correctly', () => {
        const value = changeBulkSelect({
            rows: initialRows,
            selected: []
        }, { payload: {} });
        expect(value).toEqual({ rows: [{ id: '123', selected: true }], selected: [ '123' ] });
    });
});

describe('fetchSystemsInfo', () => {

    it('should fetch systems correctly', async () => {
        const value = await fetchSystemsInfo(
            { page: 1, per_page: 1 },
            [{ id: '123' }, { id: '456' }],
            { getEntities: (systems) => Promise.resolve({ result: systems }) }
        );
        expect(value).toEqual({
            page: 1,
            per_page: 1,
            result: [ '123' ],
            total: 2
        });
    });

    it('should fetch filtered systems correctly', async () => {
        const value = await fetchSystemsInfo(
            { page: 1, per_page: 2,  filters: { hostnameOrId: '12' } },
            [
                { id: '123', display_name: 'test' },
                { id: '456', display_name: 'test' },
                { id: '789', display_name: '12test' }
            ],
            { getEntities: (systems) => Promise.resolve({ result: systems }) }
        );
        expect(value).toEqual({
            page: 1,
            per_page: 2,
            result: [ '123', '789' ],
            total: 2
        });
    });
});

describe('splitArray', () => {

    it('should split array correctly', () => {
        const value = splitArray([ '1', '2', '3' ], 2);
        expect(value).toEqual([ [ '1', '2' ], [ '3' ] ]);
    });
});

describe('getPlaybookSystems', () => {

    it('should get playbook systems correctly', () => {
        const value = getPlaybookSystems(remediationWizardTestData.existingPlaybook);
        expect(value).toEqual([{ id: 'test2', display_name: 'test2' }]);
        expect(getPlaybookSystems()).toEqual([]);
    });
});

describe('createNotification', () => {

    it('should get succes notification', () => {
        const value = createNotification('id', 'name', false);
        expect(value.variant).toEqual('success');
    });

    it('should get danger notification', () => {
        const value = createNotification('id', 'name', false, true);
        expect(value.variant).toEqual('danger');
    });
});
