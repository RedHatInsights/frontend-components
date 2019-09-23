
import React from 'react';
import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import FinalWizard from '../../addSourceWizard/FinalWizard';
import FinishedStep from '../../addSourceWizard/steps/FinishedStep';
import LoadingStep from '../../addSourceWizard/steps/LoadingStep';
import ErroredStep from '../../addSourceWizard/steps/ErroredStep';

describe('Final wizard', () => {
    describe('Renders', () => {
        let initialProps;

        beforeEach(() => {
            initialProps = {
                afterSubmit: jest.fn(),
                afterError: jest.fn(),
                onRetry: jest.fn(),
                isFinished: false,
                isErrored: false,
                successfulMessage: 'Message',
                hideSourcesButton: false
            };
        });

        it('renders loading step correctly', () => {
            const wrapper = shallow(<FinalWizard { ...initialProps }/>);
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('contains loading step', () => {
            const wrapper = mount(<FinalWizard { ...initialProps }/>);
            expect(wrapper.find(LoadingStep).length).toBe(1);
        });

        it('renders finished step correctly', () => {
            const wrapper = shallow(<FinalWizard { ...initialProps } isFinished={ true }/>);
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('contains finished step', () => {
            const wrapper = mount(<FinalWizard { ...initialProps } isFinished={ true }/>);
            expect(wrapper.find(FinishedStep).length).toBe(1);
        });

        it('renders errored step correctly', () => {
            const wrapper = shallow(<FinalWizard { ...initialProps } isErrored={ true }/>);
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('contains errored step', () => {
            const wrapper = mount(<FinalWizard { ...initialProps } isErrored={ true }/>);
            expect(wrapper.find(ErroredStep).length).toBe(1);
        });
    });
});
