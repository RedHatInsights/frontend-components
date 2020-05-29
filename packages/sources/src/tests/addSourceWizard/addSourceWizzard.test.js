import React from 'react';
import { shallow, mount } from 'enzyme';
import { act } from 'react-dom/test-utils';

import { AddSourceWizard } from '../../addSourceWizard/index';
import Form from '../../addSourceWizard/SourceAddModal';
import Modal from '../../addSourceWizard/SourceAddModal';
import FinalWizard from '../../addSourceWizard/FinalWizard';
import FinishedStep from '../../addSourceWizard/steps/FinishedStep';
import ErroredStep from '../../addSourceWizard/steps/ErroredStep';

import sourceTypes from '../helpers/sourceTypes';
import applicationTypes from '../helpers/applicationTypes';
import * as dependency from '../../api/index';
import * as createSource from '../../api/createSource';
import CloseModal from '../../addSourceWizard/CloseModal';
import LoadingStep from '../../addSourceWizard/steps/LoadingStep';

describe('AddSourceWizard', () => {
    let initialProps;

    beforeEach(() => {
        initialProps = {
            isOpen: true,
            sourceTypes,
            applicationTypes,
            onClose: jest.fn()
        };
    });

    it('renders correctly with sourceTypes', () => {
        const wrapper = shallow(<AddSourceWizard { ...initialProps }/>);
        expect(wrapper.find(Form)).toHaveLength(1);
        expect(wrapper.find(Modal)).toHaveLength(1);
    });

    it('renders correctly without sourceTypes', () => {
        const wrapper = shallow(<AddSourceWizard { ...initialProps } sourceTypes={ undefined }/>);
        expect(wrapper.find(Form)).toHaveLength(1);
        expect(wrapper.find(Modal)).toHaveLength(1);
    });

    it('show finished step after filling the form', async () => {
        jest.useFakeTimers();
        expect.assertions(8);

        createSource.doCreateSource = jest.fn(() => new Promise((resolve) => setTimeout(() => resolve('ok'), 100)));
        dependency.findSource = jest.fn(() => Promise.resolve({ data: { sources: [] } }));

        const wrapper = mount(<AddSourceWizard { ...initialProps }/>);

        await act(async() => {
            wrapper.find('input').instance().value = 'somename';
            wrapper.find('input').simulate('change');
        });
        wrapper.update();

        await act(async () => {
            jest.advanceTimersByTime(1000);
        });
        wrapper.update();

        await act(async() => {
            wrapper.find('form').simulate('submit');
        });
        wrapper.update();

        expect(wrapper.find(FinalWizard)).toHaveLength(1);
        expect(wrapper.find(LoadingStep)).toHaveLength(1);
        expect(wrapper.find(ErroredStep)).toHaveLength(0);
        expect(wrapper.find(FinishedStep)).toHaveLength(0);

        await act(async () => {
            jest.advanceTimersByTime(100);
        });
        wrapper.update();

        expect(wrapper.find(FinalWizard)).toHaveLength(1);
        expect(wrapper.find(LoadingStep)).toHaveLength(0);
        expect(wrapper.find(ErroredStep)).toHaveLength(0);
        expect(wrapper.find(FinishedStep)).toHaveLength(1);

        jest.useRealTimers();
    });

    it('pass created source to afterSuccess function', async () => {
        jest.useFakeTimers();

        const afterSubmitMock = jest.fn();
        createSource.doCreateSource = jest.fn(() => new Promise((resolve) => resolve({ name: 'source' })));
        dependency.findSource = jest.fn(() => Promise.resolve({ data: { sources: [] } }));

        const wrapper = mount(<AddSourceWizard { ...initialProps } afterSuccess={ afterSubmitMock }/>);

        await act(async () => {
            wrapper.find('input').instance().value = 'somename';
            wrapper.find('input').simulate('change');
        });
        wrapper.update();

        await act(async () => {
            jest.advanceTimersByTime(1000);
        });
        wrapper.update();

        await act(async() => {
            wrapper.find('form').simulate('submit');
        });
        wrapper.update();

        await act(async () => {
            jest.runAllTimers();
        });
        wrapper.update();

        expect(afterSubmitMock).toHaveBeenCalledWith({ name: 'source' });

        jest.useRealTimers();
    });

    it('pass values to onClose function', async () => {
        jest.useFakeTimers();

        const CANCEL_BUTTON_INDEX = 3;
        const NAME = 'name';
        const onClose = jest.fn();
        dependency.findSource = jest.fn(() => Promise.resolve({ data: { sources: [] } }));

        const wrapper = mount(<AddSourceWizard { ...initialProps } onClose={ onClose }/>);

        await act(async () => {
            wrapper.find('input').instance().value = NAME;
            wrapper.find('input').simulate('change');
        });
        wrapper.update();

        await act(async () => {
            jest.advanceTimersByTime(1000);
        });
        wrapper.update();

        await act(async () => {
            wrapper.find('Button').at(CANCEL_BUTTON_INDEX).simulate('click');
        });

        wrapper.update();

        expect(wrapper.find(CloseModal).props().isOpen).toEqual(true);

        await act(async () => {
            wrapper.find('button#on-exit-button').simulate('click');
        });

        wrapper.update();

        expect(onClose).toHaveBeenCalledWith({ source: { name: NAME } });

        jest.useRealTimers();
    });

    it('stay on the wizard', async () => {
        jest.useFakeTimers();

        const CANCEL_BUTTON_INDEX = 3;
        const NAME = 'name';
        const onClose = jest.fn();
        dependency.findSource = jest.fn(() => Promise.resolve({ data: { sources: [] } }));

        const wrapper = mount(<AddSourceWizard { ...initialProps } onClose={ onClose }/>);

        await act(async () => {
            wrapper.find('input').instance().value = NAME;
            wrapper.find('input').simulate('change');
        });
        wrapper.update();

        await act(async () => {
            jest.advanceTimersByTime(1000);
        });
        wrapper.update();

        await act(async () => {
            wrapper.find('Button').at(CANCEL_BUTTON_INDEX).simulate('click');
        });
        wrapper.update();

        expect(wrapper.find(CloseModal).props().isOpen).toEqual(true);

        await act(async () => {
            wrapper.find('button#on-stay-button').simulate('click');
        });
        wrapper.update();

        expect(wrapper.find(CloseModal).props().isOpen).toEqual(false);

        expect(onClose).not.toHaveBeenCalled();
        expect(wrapper.find('input').instance().value).toEqual(NAME);

        jest.useRealTimers();
    });

    it('show error step after failing the form', async () => {
        jest.useFakeTimers();

        dependency.findSource = jest.fn(() => Promise.resolve({ data: { sources: [] } }));
        const ERROR_MESSAGE = 'fail';
        createSource.doCreateSource = jest.fn(() => new Promise((_resolve, reject) => reject(ERROR_MESSAGE)));

        const wrapper = mount(<AddSourceWizard { ...initialProps }/>);

        await act(async () => {
            wrapper.find('input').instance().value = 'somename';
            wrapper.find('input').simulate('change');
        });
        wrapper.update();

        await act(async () => {
            jest.advanceTimersByTime(1000);
        });
        wrapper.update();

        await act(async() => {
            wrapper.find('form').simulate('submit');
        });
        wrapper.update();

        expect(wrapper.find(FinalWizard)).toHaveLength(1);
        expect(wrapper.find(FinishedStep)).toHaveLength(0);
        expect(wrapper.find(ErroredStep)).toHaveLength(1);
        expect(wrapper.find(ErroredStep).html().includes(ERROR_MESSAGE)).toEqual(true);

        jest.useRealTimers();
    });
});
