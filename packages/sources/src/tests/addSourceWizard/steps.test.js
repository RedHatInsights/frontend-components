import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Button, EmptyStateBody } from '@patternfly/react-core';

import FinishedStep from '../../addSourceWizard/steps/FinishedStep';
import LoadingStep from '../../addSourceWizard/steps/LoadingStep';
import ErroredStep from '../../addSourceWizard/steps/ErroredStep';

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
                hideSourcesButton: false
            };
        });

        it('renders correctly', () => {
            const wrapper = shallow(<FinishedStep { ...initialProps }/>);
            expect(toJson(wrapper)).toMatchSnapshot();
            expect(wrapper.find('a[href="/hybrid/settings/sources"]').length).toBe(1);
            expect(wrapper.find(EmptyStateBody).html().includes('Here I Am')).toBe(true);
        });

        it('renders withou takemetosources button', () => {
            const wrapper = shallow(<FinishedStep { ...initialProps } hideSourcesButton={ true }/>);
            expect(toJson(wrapper)).toMatchSnapshot();
            expect(wrapper.find('a[href="/hybrid/settings/sources"]').length).toBe(0);
        });

        it('calls onClose function', () => {
            const wrapper = shallow(<FinishedStep { ...initialProps }/>);
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
            const wrapper = shallow(<LoadingStep { ...initialProps }/>);
            expect(toJson(wrapper)).toMatchSnapshot();
            expect(wrapper.find(EmptyStateBody).html().includes('Here I Am')).toBe(true);
        });

        it('renders correctly', () => {
            const wrapper = shallow(<LoadingStep />);
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('calls onClose function', () => {
            const wrapper = shallow(<LoadingStep { ...initialProps }/>);
            wrapper.find(Button).first().simulate('click');
            expect(spyFunction).toHaveBeenCalled();
        });
    });

    describe('ErroredStep', () => {

        beforeEach(() => {
            initialProps = {
                onClose: spyFunction,
                onRetry: spyFunctionSecond
            };
        });

        it('renders correctly', () => {
            const wrapper = shallow(<ErroredStep { ...initialProps }/>);
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('calls onClose function', () => {
            const wrapper = shallow(<ErroredStep { ...initialProps }/>);
            wrapper.find(Button).first().simulate('click');
            expect(spyFunction).toHaveBeenCalled();
        });

        it('calls onRetry function', () => {
            const wrapper = shallow(<ErroredStep { ...initialProps }/>);
            wrapper.find(Button).last().simulate('click');
            expect(spyFunctionSecond).toHaveBeenCalled();
        });
    });
});
