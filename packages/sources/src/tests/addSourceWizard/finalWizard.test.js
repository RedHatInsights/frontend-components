
import React from 'react';
import { act } from 'react-dom/test-utils';
import { EmptyStateSecondaryActions, Button, Title, EmptyState, EmptyStateBody } from '@patternfly/react-core';

import FinalWizard from '../../addSourceWizard/FinalWizard';
import FinishedStep from '../../addSourceWizard/steps/FinishedStep';
import LoadingStep from '../../addSourceWizard/steps/LoadingStep';
import ErroredStep from '../../addSourceWizard/steps/ErroredStep';
import TimeoutStep from '../../addSourceWizard/steps/TimeoutStep';

import mount from '../__mocks__/mount';

import * as api from '../../api';
import { MemoryRouter } from 'react-router-dom';

describe('Final wizard', () => {
    let initialProps;
    let id;

    beforeEach(() => {
        id = 'some-id';
        initialProps = {
            afterSubmit: jest.fn(),
            afterError: jest.fn(),
            isFinished: false,
            isErrored: false,
            successfulMessage: 'Message',
            hideSourcesButton: false,
            returnButtonTitle: 'Go back to my application',
            reset: jest.fn(),
            createdSource: {
                id,
                applications: []
            }
        };
    });

    it('contains loading step', () => {
        const wrapper = mount(<FinalWizard { ...initialProps }/>);
        expect(wrapper.find(LoadingStep)).toHaveLength(1);
        expect(wrapper.find(EmptyState).find(Title).text()).toEqual('Validating source credentials');
    });

    it('renders finished step correctly', () => {
        const wrapper = mount(<FinalWizard { ...initialProps } isFinished={ true }/>);
        expect(wrapper.find(FinishedStep)).toHaveLength(1);
        expect(wrapper.find(EmptyState).find(Title).text()).toEqual('Configuration successful');
    });

    it('calls reset', () => {
        const wrapper = mount(<FinalWizard { ...initialProps } isFinished={ true } hideSourcesButton={true}/>);
        wrapper.find(EmptyStateSecondaryActions).find(Button).simulate('click');
        expect(initialProps.reset).toHaveBeenCalled();
    });

    it('renders errored step correctly', () => {
        const wrapper = mount(<FinalWizard { ...initialProps } isErrored={ true }/>);
        expect(wrapper.find(ErroredStep)).toHaveLength(1);
        expect(wrapper.find(EmptyState).find(Title).text()).toEqual('Something went wrong');
    });

    it('retries to create source on errored', async () => {
        const tryAgain = jest.fn();

        const wrapper = mount(<FinalWizard { ...initialProps } isErrored={ true } tryAgain={tryAgain}/>);
        expect(wrapper.find(ErroredStep)).toHaveLength(1);
        expect(wrapper.find(EmptyState).find(Title).text()).toEqual('Something went wrong');
        expect(tryAgain).not.toHaveBeenCalled();

        wrapper.find(Button).at(1).simulate('click');

        expect(tryAgain).toHaveBeenCalled();
    });

    it('removes source on errored step correctly - when unavailable', async () => {
        const ERROR_MSG = 'Some error message';
        const removeSource = jest.fn().mockImplementation(() => Promise.resolve());

        api.getSourcesApi = () => ({
            removeSource
        });

        const wrapper = mount(<FinalWizard
            { ...initialProps }
            isFinished={ true }
            createdSource={{
                id,
                applications: [{
                    availability_status: 'unavailable',
                    availability_status_error: ERROR_MSG
                }]
            }}
        />);
        expect(wrapper.find(ErroredStep)).toHaveLength(1);
        expect(wrapper.find(EmptyState).find(Title).text()).toEqual('Configuration unsuccessful');
        expect(wrapper.find(EmptyStateBody).text()).toEqual(ERROR_MSG);

        await act(async () => {
            wrapper.find(EmptyStateSecondaryActions).find(Button).simulate('click');
        });
        wrapper.update();

        expect(removeSource).toHaveBeenCalledWith(id);
        expect(wrapper.find(FinishedStep)).toHaveLength(1);
        expect(wrapper.find(EmptyState).find(Title).text()).toEqual('Removing successful');
    });

    it('removes source on errored step correctly, restart when removing failed', async () => {
        const ERROR_MSG = 'Some error message';
        const removeSource = jest.fn().mockImplementation(() => Promise.reject());

        api.getSourcesApi = () => ({
            removeSource
        });

        const wrapper = mount(<FinalWizard
            { ...initialProps }
            isFinished={ true }
            createdSource={{
                id,
                applications: [{
                    availability_status: 'unavailable',
                    availability_status_error: ERROR_MSG
                }]
            }}
        />);
        expect(wrapper.find(ErroredStep)).toHaveLength(1);
        expect(wrapper.find(EmptyState).find(Title).text()).toEqual('Configuration unsuccessful');
        expect(wrapper.find(EmptyStateBody).text()).toEqual(ERROR_MSG);

        await act(async () => {
            wrapper.find(EmptyStateSecondaryActions).find(Button).simulate('click');
        });
        wrapper.update();

        expect(wrapper.find(ErroredStep)).toHaveLength(1);
        expect(wrapper.find(EmptyState).find(Title).text()).toEqual('Configuration unsuccessful');
        expect(wrapper.find(EmptyStateBody).text()).toEqual(ERROR_MSG);
    });

    it('when configuration failed, go to edit', async () => {
        const ERROR_MSG = 'Some error message';

        const wrapper = mount(<FinalWizard
            { ...initialProps }
            isFinished={ true }
            createdSource={{
                id,
                applications: [{
                    availability_status: 'unavailable',
                    availability_status_error: ERROR_MSG
                }]
            }}
        />);
        expect(wrapper.find(ErroredStep)).toHaveLength(1);
        expect(wrapper.find(EmptyState).find(Title).text()).toEqual('Configuration unsuccessful');
        expect(wrapper.find(EmptyStateBody).text()).toEqual(ERROR_MSG);

        await act(async () => {
            wrapper.find(Button).at(1).simulate('click', { button: 0 });
        });
        wrapper.update();

        expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual(`/sources/edit/${id}`);
    });

    it('shows timeouted step', async () => {
        const wrapper = mount(<FinalWizard
            { ...initialProps }
            isFinished={ true }
            createdSource={{
                id,
                applications: [{
                    availability_status: null
                }]
            }}
        />);
        expect(wrapper.find(TimeoutStep)).toHaveLength(1);
        expect(wrapper.find(EmptyState).find(Title).text()).toEqual('Configuration not yet complete');
    });

    it('shows successful step', async () => {
        const wrapper = mount(<FinalWizard
            { ...initialProps }
            isFinished={ true }
            createdSource={{
                id,
                applications: [{
                    availability_status: 'available'
                }]
            }}
        />);
        expect(wrapper.find(FinishedStep)).toHaveLength(1);
        expect(wrapper.find(EmptyState).find(Title).text()).toEqual('Configuration successful');
    });
});
