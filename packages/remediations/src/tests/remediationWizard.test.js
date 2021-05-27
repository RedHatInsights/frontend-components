/* eslint-disable camelcase */
import React from 'react';
import { act } from 'react-dom/test-utils';
import * as dependency from '../api/index';
import { remediationWizardTestData } from './testData';
import { mount } from 'enzyme';
import { RemediationWizard } from '../RemediationWizard/RemediationWizard';
import configureStore from 'redux-mock-store';
import promiseMiddleware from 'redux-promise-middleware';
import { Provider } from 'react-redux';

jest.mock('../redux/actions/host-actions', () => {
    const actions = jest.requireActual('../redux/actions/host-actions');
    return {
        __esModule: true,
        ...actions,
        fetchHostsById: () => ({
            type: 'FETCH_SELECTED_HOSTS',
            payload: () => Promise.resolve([])
        })
    };
});

jest.mock('../api/index', () => {
    const api = jest.requireActual('../api/index');
    const { remediationWizardTestData } = jest.requireActual('./testData');
    return {
        __esModule: true,
        ...api,
        getResolutionsBatch: () => Promise.resolve(remediationWizardTestData.issueResolutionsResponse)
    };
});

describe('RemediationWizard', () => {
    let initialProps;
    let wrapper;
    let mockStore = configureStore([ promiseMiddleware ]);

    beforeEach(() => {
        initialProps = {
            data: {
                issues: remediationWizardTestData.issues,
                systems: remediationWizardTestData.systems
            },
            setOpen: jest.fn()
        };
    });

    it('should render wizard correctly', async () => {
        const store = mockStore({});
        const getResolutionsBatchSpy = jest.spyOn(dependency, 'getResolutionsBatch');
        const registrySpy = jest.fn();

        await act(async() => {
            wrapper = mount(
                <Provider store={store}>
                    <RemediationWizard { ...initialProps } registry={{
                        register: registrySpy
                    }}/>
                </Provider>
            );
        });

        await act(async() => {
            wrapper.update();
        });

        expect(getResolutionsBatchSpy).toHaveBeenCalledTimes(1);
        expect(wrapper.find(RemediationWizard)).toHaveLength(1);
    });
});
