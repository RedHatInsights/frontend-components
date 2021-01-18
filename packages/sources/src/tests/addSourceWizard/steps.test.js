import React from 'react';
import { Button, EmptyStateBody, Title, Bullseye, Spinner, EmptyState, EmptyStateSecondaryActions, Alert } from '@patternfly/react-core';
import { CheckCircleIcon, ExclamationCircleIcon, WrenchIcon } from '@patternfly/react-icons';

import FinishedStep from '../../addSourceWizard/steps/FinishedStep';
import LoadingStep from '../../addSourceWizard/steps/LoadingStep';
import ErroredStep from '../../addSourceWizard/steps/ErroredStep';
import TimeoutStep from '../../addSourceWizard/steps/TimeoutStep';

import mount from '../__mocks__/mount';
import AmazonFinishedStep from '../../addSourceWizard/steps/AmazonFinishedStep';

describe('Steps components', () => {
    let initialProps;
    let spyFunction;
    let spyFunctionSecond;

    beforeEach(() => {
        spyFunction = jest.fn();
        spyFunctionSecond = jest.fn();
    });

    afterEach(() => {
        spyFunction.mockReset();
        spyFunctionSecond.mockReset();
    });

    describe('FinishedStep', () => {
        beforeEach(() => {
            initialProps = {
                onClose: spyFunction,
                successfulMessage: 'Here I Am',
                hideSourcesButton: false,
                returnButtonTitle: 'Go back to my application'
            };
        });

        it('renders correctly', () => {
            const wrapper = mount(<FinishedStep { ...initialProps }/>);

            expect(wrapper.find(Bullseye)).toHaveLength(1);
            expect(wrapper.find(CheckCircleIcon)).toHaveLength(1);
            expect(wrapper.find(EmptyState)).toHaveLength(1);
            expect(wrapper.find(Button)).toHaveLength(2);

            expect(wrapper.find('a')).toHaveLength(1);
            expect(wrapper.find('a').props().href).toEqual('/settings/sources');
            expect(wrapper.find(EmptyStateBody).html().includes('Here I Am')).toBe(true);
        });

        it('renders without takemetosources button', () => {
            const wrapper = mount(<FinishedStep { ...initialProps } hideSourcesButton={ true }/>);
            expect(wrapper.find('a')).toHaveLength(0);
        });

        it('calls onClose function', () => {
            const wrapper = mount(<FinishedStep { ...initialProps }/>);
            wrapper.find(Button).first().simulate('click');
            expect(spyFunction).toHaveBeenCalled();
        });
    });

    describe('LoadingStep', () => {
        beforeEach(() => {
            initialProps = {
                onClose: spyFunction,
                customText: 'Here I Am'
            };
        });

        it('renders correctly with custom props', () => {
            const wrapper = mount(<LoadingStep { ...initialProps }/>);

            expect(wrapper.find(Bullseye)).toHaveLength(1);
            expect(wrapper.find(Spinner)).toHaveLength(1);
            expect(wrapper.find(EmptyState)).toHaveLength(1);
            expect(wrapper.find(Button)).toHaveLength(1);

            expect(wrapper.find(Title).html().includes('Here I Am')).toBe(true);
        });

        it('calls onClose function', () => {
            const wrapper = mount(<LoadingStep { ...initialProps }/>);
            wrapper.find(Button).first().simulate('click');
            expect(spyFunction).toHaveBeenCalled();
        });
    });

    describe('ErroredStep', () => {
        beforeEach(() => {
            initialProps = {
                onClose: spyFunction,
                returnButtonTitle: 'Go back to my application'
            };
        });

        it('renders correctly', () => {
            const wrapper = mount(<ErroredStep { ...initialProps }/>);

            expect(wrapper.find(Bullseye)).toHaveLength(1);
            expect(wrapper.find(ExclamationCircleIcon)).toHaveLength(1);
            expect(wrapper.find(EmptyState)).toHaveLength(1);
            expect(wrapper.find(Button)).toHaveLength(1);
        });

        it('renders correctly with message', () => {
            const ERROR_MESSAGE = 'I am a little error, nice to meet you';
            const wrapper = mount(<ErroredStep { ...initialProps } message={ERROR_MESSAGE}/>);

            expect(wrapper.find(EmptyStateBody).text()).toEqual(ERROR_MESSAGE);
        });

        it('calls onClose function', () => {
            const wrapper = mount(<ErroredStep { ...initialProps }/>);
            wrapper.find(Button).first().simulate('click');
            expect(spyFunction).toHaveBeenCalled();
        });

        it('calls primaryAction function', () => {
            const wrapper = mount(<ErroredStep { ...initialProps } primaryAction={spyFunctionSecond}/>);
            wrapper.find(Button).simulate('click');
            expect(spyFunctionSecond).toHaveBeenCalled();
        });
    });

    describe('TimeoutStep', () => {
        beforeEach(() => {
            initialProps = {
                onClose: spyFunction,
                returnButtonTitle: 'go back'
            };
        });

        it('renders correctly', () => {
            const wrapper = mount(<TimeoutStep { ...initialProps }/>);

            expect(wrapper.find(Bullseye)).toHaveLength(1);
            expect(wrapper.find(WrenchIcon)).toHaveLength(1);
            expect(wrapper.find(EmptyState)).toHaveLength(1);
            expect(wrapper.find(Button)).toHaveLength(1);
        });

        it('renders correctly customized', () => {
            const wrapper = mount(<TimeoutStep
                { ...initialProps }
                title="pekny nadpis"
                secondaryActions={<button>some button here</button>}
            />);

            expect(wrapper.find(Title).first().text()).toEqual('pekny nadpis');
            expect(wrapper.find(EmptyStateSecondaryActions).find('button')).toHaveLength(1);
        });

        it('calls onClose function', () => {
            const wrapper = mount(<TimeoutStep { ...initialProps }/>);
            wrapper.find(Button).simulate('click');
            expect(spyFunction).toHaveBeenCalled();
        });
    });

    describe('AmazonFinishedStep', () => {
        beforeEach(() => {
            initialProps = {
                onClose: spyFunction
            };
        });

        it('renders correctly', () => {
            const wrapper = mount(<AmazonFinishedStep { ...initialProps }/>);

            expect(wrapper.find(Bullseye)).toHaveLength(1);
            expect(wrapper.find(CheckCircleIcon)).toHaveLength(5);
            expect(wrapper.find(EmptyState)).toHaveLength(1);
            expect(wrapper.find(Button)).toHaveLength(1);
            expect(wrapper.find(Alert)).toHaveLength(1);
            expect(wrapper.find('a')).toHaveLength(5);
        });

        it('calls onClose function', () => {
            const wrapper = mount(<AmazonFinishedStep { ...initialProps }/>);
            wrapper.find(Button).simulate('click');
            expect(spyFunction).toHaveBeenCalled();
        });
    });
});
