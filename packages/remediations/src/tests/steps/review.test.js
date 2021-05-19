/* eslint-disable camelcase */
import React from 'react';
import FormRenderer from '@data-driven-forms/react-form-renderer/dist/esm/form-renderer';
import FormTemplate from '@data-driven-forms/pf4-component-mapper/dist/esm/form-template';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { AUTO_REBOOT, RESOLUTIONS, SYSTEMS } from '../../utils';
import promiseMiddleware from 'redux-promise-middleware';
import configureStore from 'redux-mock-store';
import Review from '../../steps/review';
import { BodyRow } from '@patternfly/react-table/dist/js/components/Table/base';
import { remediationWizardTestData } from '../testData';
import { Provider } from 'react-redux';

const RendererWrapper = (props) => (
    <FormRenderer
        onSubmit={() => {}}
        FormTemplate={FormTemplate}
        componentMapper={{
            review: {
                component: Review,
                data: {
                    issues: [
                        {
                            id: 'testId'
                        },
                        {
                            id: 'testId2'
                        }
                    ],
                    systems: remediationWizardTestData.systems
                },
                issuesById: remediationWizardTestData.issuesById
            }
        }}
        initialValues={{
            [RESOLUTIONS]: remediationWizardTestData.resolutions,
            [SYSTEMS]: { ...remediationWizardTestData.selectedSystems, testId2: [ 'system2' ] }
        }}
        schema={{ fields: [] }}
        subscription={{ values: true }}
        {...props}
    />
);

const createSchema = () => ({
    fields: [
        {
            name: AUTO_REBOOT,
            component: 'review'
        }
    ]
});

let mockStore = configureStore([ promiseMiddleware ]);

const initialState = {
    hostReducer: {
        hosts: [{ id: 'system', display_name: 'system1' }, { id: 'system2', display_name: 'system2' }]
    }
};

describe('Review', () => {

    let initialProps;
    let onSubmit;

    beforeEach(() => {
        initialProps = {
            data: {
                issues: remediationWizardTestData.issues,
                systems: remediationWizardTestData.systems
            }
        };
        onSubmit = jest.fn();
    });

    it('should render correctly', async () => {
        let wrapper;
        const store = mockStore(initialState);
        await act(async() => {
            wrapper = mount(
                <Provider store={store}>
                    <RendererWrapper schema={createSchema({})} {...initialProps} />
                </Provider>);
        });
        wrapper.update();
        expect(wrapper.find('Form')).toHaveLength(1);
        expect(wrapper.find('table')).toHaveLength(3);
        expect(wrapper.find(BodyRow)).toHaveLength(6);
        expect(wrapper.find('button')).toHaveLength(7);
    });

    it('should change autoreboot correctly', async () => {
        let wrapper;
        const store = mockStore(initialState);
        await act(async() => {
            wrapper = mount(
                <Provider store={store}>
                    <RendererWrapper schema={createSchema({})} {...initialProps} />
                </Provider>);
        });
        wrapper.update();
        expect(wrapper.find('Button[variant="link"]').props().children).toEqual([ 'Turn ', 'off', ' autoreboot' ]);
        wrapper.find('Button[variant="link"]').simulate('click');
        expect(wrapper.find('Button[variant="link"]').props().children).toEqual([ 'Turn ', 'on', ' autoreboot' ]);
    });

    it('should sort records correctly', async () => {
        let wrapper;
        const store = mockStore(initialState);
        await act(async() => {
            wrapper = mount(
                <Provider store={store}>
                    <RendererWrapper schema={createSchema({})} {...initialProps} />
                </Provider>);
        });
        wrapper.update();
        expect(wrapper.find('td').at(2).props().children).toEqual('test_description');
        wrapper.find('button[className="pf-c-table__button"]').at(2).simulate('click');
        wrapper.find('button[className="pf-c-table__button"]').at(2).simulate('click');
        wrapper.find('button[className="pf-c-table__button"]').at(2).simulate('click');
        expect(wrapper.find('td').at(2).props().children).toEqual('description');
    });

    it('should submit the form', async () => {
        let wrapper;
        const store = mockStore(initialState);
        await act(async() => {
            wrapper = mount(
                <Provider store={store}>
                    <RendererWrapper schema={createSchema({})} {...initialProps} onSubmit={onSubmit}/>
                </Provider>);
        });
        wrapper.update();
        wrapper.find('Form').simulate('submit');
        expect(onSubmit).toHaveBeenCalledTimes(1);
    });
});
