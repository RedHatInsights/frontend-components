/* eslint-disable camelcase */
import React from 'react';
import FormRenderer from '@data-driven-forms/react-form-renderer/dist/esm/form-renderer';
import FormTemplate from '@data-driven-forms/pf4-component-mapper/dist/esm/form-template';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import promiseMiddleware from 'redux-promise-middleware';
import configureStore from 'redux-mock-store';
import { EXISTING_PLAYBOOK, EXISTING_PLAYBOOK_SELECTED, SYSTEMS } from '../../utils';
import { remediationWizardTestData } from '../testData';
import ReviewSystems from '../../steps/reviewSystems';
import { Provider } from 'react-redux';
import ReducerRegistry from '@redhat-cloud-services/frontend-components-utilities/ReducerRegistry';

jest.mock('@redhat-cloud-services/frontend-components/Inventory', () => ({
    __esModule: true,
    // eslint-disable-next-line react/display-name
    InventoryTable: () => <div>Inventory</div>
}));

jest.mock('../../utils', () => {
    return {
        dedupeArray: jest.fn((props) => props),
        getPlaybookSystems: jest.fn(() => []),
        SYSTEMS: 'systems'
    };
});

const RendererWrapper = (props) => (
    <FormRenderer
        onSubmit={() => {}}
        FormTemplate={FormTemplate}
        componentMapper={{
            'review-systems': {
                component: ReviewSystems,
                issues: remediationWizardTestData.issues,
                systems: remediationWizardTestData.systems
            }
        }}
        initialValues={{
            [EXISTING_PLAYBOOK_SELECTED]: true,
            [EXISTING_PLAYBOOK]: {
                issues: [{
                    id: 'test',
                    systems: [{ id: 'test', display_name: 'test' }]
                }]
            }
        }}
        schema={{ fields: [] }}
        {...props}
    />
);

const schema = {
    fields: [{
        name: SYSTEMS,
        component: 'review-systems',
        issues: [{
            id: 'test',
            systems: [{ id: 'test', display_name: 'test' }]
        }],
        systems: [ 'test2' ],
        registry: new ReducerRegistry({}, [ promiseMiddleware ])
    }]
};

describe('ReviewSystems', () => {

    let mockStore = configureStore([ promiseMiddleware ]);

    const initialState = {
        hostReducer: {
            hosts: [{ id: 'test2', display_name: 'test2' }]
        }
    };

    it('should render correctly', async () => {
        const store = mockStore(initialState);
        let wrapper;
        await act(async() => {
            wrapper = mount(
                <Provider store={store}>
                    <RendererWrapper schema={schema} />
                </Provider>);
        });
        expect(wrapper.find(ReviewSystems)).toHaveLength(1);
        expect(wrapper.find('Button[type="submit"]')).toHaveLength(2);
    });
});
