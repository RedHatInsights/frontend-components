/* eslint-disable camelcase */
import React from 'react';
import FormRenderer from '@data-driven-forms/react-form-renderer/dist/esm/form-renderer';
import FormTemplate from '@data-driven-forms/pf4-component-mapper/dist/esm/form-template';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import ReviewActions from '../../steps/reviewActions';
import { reviewActionsFields } from '../../RemediationWizard/schema';
import promiseMiddleware from 'redux-promise-middleware';
import configureStore from 'redux-mock-store';
import { EXISTING_PLAYBOOK, EXISTING_PLAYBOOK_SELECTED, ISSUES_MULTIPLE, RESOLUTIONS, SYSTEMS } from '../../utils';
import { BodyRow } from '@patternfly/react-table/dist/js/components/Table/base';
import { remediationWizardTestData } from '../testData';
import { Provider } from 'react-redux';

jest.mock('../../common/SystemsTable', () => ({
    __esModule: true,
    // eslint-disable-next-line react/display-name
    SystemsTableWithContext: () => <table></table>
}));

const RendererWrapper = (props) => (
    <FormRenderer
        onSubmit={() => {}}
        FormTemplate={FormTemplate}
        componentMapper={{
            'review-actions': {
                component: ReviewActions,
                issues: remediationWizardTestData.issues
            }
        }}
        initialValues={{
            [EXISTING_PLAYBOOK_SELECTED]: true,
            [EXISTING_PLAYBOOK]: {
                auto_reboot: true,
                id: 'id',
                issues: [{
                    id: 'test'
                }],
                name: 'test',
                needs_reboot: false
            },
            [RESOLUTIONS]: remediationWizardTestData.resolutions,
            [ISSUES_MULTIPLE]: remediationWizardTestData.issuesMultiple,
            [SYSTEMS]: remediationWizardTestData.selectedSystems
        }}
        schema={{ fields: [] }}
        {...props}
    />
);

const createSchema = () => ({
    fields: reviewActionsFields
});

let mockStore = configureStore([ promiseMiddleware ]);

const initialState = {
    hostReducer: {
        hosts: [{ id: 'test2', display_name: 'test2' }]
    }
};

describe('ReviewActions', () => {

    let onSubmit;

    beforeEach(() => {
        onSubmit = jest.fn();
    });

    it('should render correctly', async () => {
        let wrapper;
        const store = mockStore(initialState);
        await act(async() => {
            wrapper = mount(
                <Provider store={store}>
                    <RendererWrapper schema={createSchema()} />
                </Provider>);
        });
        expect(wrapper.find('input[type="radio"]')).toHaveLength(2);
        expect(wrapper.find('table')).toHaveLength(2);
        expect(wrapper.find(BodyRow)).toHaveLength(2);
    });

    it('should sort table & submit review option', async () => {
        let wrapper;
        const store = mockStore(initialState);
        await act(async() => {
            wrapper = mount(
                <Provider store={store}>
                    <RendererWrapper schema={createSchema()} onSubmit={onSubmit}/>
                </Provider>);
        });
        wrapper.find('button[className="pf-c-table__button"]').last().simulate('click');
        wrapper.find('input[type="radio"]').first().simulate('change', {
            target: { checked: true } });
        wrapper.update();
        wrapper.find('Form').simulate('submit');
        expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    it('should submit accept option', async () => {
        let wrapper;
        const store = mockStore(initialState);
        await act(async() => {
            wrapper = mount(
                <Provider store={store}>
                    <RendererWrapper schema={createSchema()} onSubmit={onSubmit}/>
                </Provider>);
        });
        wrapper.find('input[type="radio"]').last().simulate('change', {
            target: { checked: true } });
        wrapper.update();
        wrapper.find('Form').simulate('submit');
        expect(onSubmit).toHaveBeenCalledTimes(1);
    });
});
