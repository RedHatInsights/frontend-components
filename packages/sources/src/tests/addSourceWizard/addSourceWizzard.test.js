import React from 'react';
import { shallow, mount } from 'enzyme';
import { Button } from '@patternfly/react-core';

import { AddSourceWizard } from '../../addSourceWizard/index';
import Form from '../../addSourceWizard/SourceAddModal';
import FormRenderer from '../../sourceFormRenderer/index';
import Modal from '../../addSourceWizard/SourceAddModal';
import FinalWizard from '../../addSourceWizard/FinalWizard';
import FinishedStep from '../../addSourceWizard/steps/FinishedStep';
import ErroredStep from '../../addSourceWizard/steps/ErroredStep';

import sourceTypes from '../helpers/sourceTypes';
import applicationTypes from '../helpers/applicationTypes';
import * as dependency from '../../api/index';
import * as createSource from '../../api/createSource';
import CloseModal from '../../addSourceWizard/CloseModal';

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

    it('show finished step after filling the form', (done) => {
        createSource.doCreateSource = jest.fn(() => new Promise((resolve) => resolve('ok')));
        dependency.findSource = jest.fn(() => Promise.resolve({ data: { sources: [] } }));

        const wrapper = mount(<AddSourceWizard { ...initialProps }/>);
        const form = wrapper.find(FormRenderer).children().children().instance().form;

        form.change('source.name', 'nameee');

        setTimeout(() => {
            form.submit().then(() => {
                wrapper.update();
                expect(wrapper.find(FinalWizard)).toHaveLength(1);
                expect(wrapper.find(FinishedStep)).toHaveLength(1);
                expect(wrapper.find(ErroredStep)).toHaveLength(0);
                done();
            });
        }, 1000);
    });

    it('pass created source to afterSuccess function', (done) => {
        const afterSubmitMock = jest.fn();
        createSource.doCreateSource = jest.fn(() => new Promise((resolve) => resolve({ name: 'source' })));
        dependency.findSource = jest.fn(() => Promise.resolve({ data: { sources: [] } }));

        const wrapper = mount(<AddSourceWizard { ...initialProps } afterSuccess={ afterSubmitMock }/>);
        const form = wrapper.find(FormRenderer).children().children().instance().form;

        form.change('source.name', 'nameee');

        setTimeout(() => {
            form.submit().then(() => {
                wrapper.update();
                wrapper.find(Button).at(0).simulate('click');
                wrapper.update();

                expect(afterSubmitMock).toHaveBeenCalledWith({ name: 'source' });
                done();
            });
        }, 1000);
    });

    it('pass values to onClose function', (done) => {
        const CANCEL_BUTTON_INDEX = 3;
        const LEAVE_BUTTON_INDEX = 1;
        const NAME = 'name';
        const onClose = jest.fn();
        dependency.findSource = jest.fn(() => Promise.resolve({ data: { sources: [] } }));

        const wrapper = mount(<AddSourceWizard { ...initialProps } onClose={ onClose }/>);
        const form = wrapper.find(FormRenderer).children().children().instance().form;

        form.change('source.name', NAME);

        setTimeout(() => {
            wrapper.update();
            wrapper.find('Button').at(CANCEL_BUTTON_INDEX).simulate('click');
            wrapper.update();

            expect(wrapper.find(CloseModal).props().isOpen).toEqual(true);

            wrapper.find('Button').at(LEAVE_BUTTON_INDEX).simulate('click');
            wrapper.update();

            expect(onClose).toHaveBeenCalledWith({ source: { name: NAME } });
            done();
        }, 1000);
    });

    it('stay on the wizard', (done) => {
        const CANCEL_BUTTON_INDEX = 3;
        const STAY_BUTTON_INDEX = 2;
        const NAME = 'name';
        const onClose = jest.fn();
        dependency.findSource = jest.fn(() => Promise.resolve({ data: { sources: [] } }));

        const wrapper = mount(<AddSourceWizard { ...initialProps } onClose={ onClose }/>);
        const form = wrapper.find(FormRenderer).children().children().instance().form;

        form.change('source.name', NAME);

        setTimeout(() => {
            wrapper.update();
            wrapper.find('Button').at(CANCEL_BUTTON_INDEX).simulate('click');
            wrapper.update();

            expect(wrapper.find(CloseModal).props().isOpen).toEqual(true);

            wrapper.find('Button').at(STAY_BUTTON_INDEX).simulate('click');
            wrapper.update();

            expect(wrapper.find(CloseModal).props().isOpen).toEqual(false);

            expect(onClose).not.toHaveBeenCalled();
            expect(wrapper.find('input').instance().value).toEqual(NAME);
            done();
        }, 1000);
    });

    it('show error step after failing the form', (done) => {
        const ERROR_MESSAGE = 'fail';
        createSource.doCreateSource = jest.fn(() => new Promise((_resolve, reject) => reject(ERROR_MESSAGE)));

        const wrapper = mount(<AddSourceWizard { ...initialProps }/>);
        const form = wrapper.find(FormRenderer).children().children().instance().form;

        form.change('source.name', 'nameee');

        setTimeout(() => {
            form.submit().then(() => {
                wrapper.update();
                expect(wrapper.find(FinalWizard)).toHaveLength(1);
                expect(wrapper.find(FinishedStep)).toHaveLength(0);
                expect(wrapper.find(ErroredStep)).toHaveLength(1);
                expect(wrapper.find(ErroredStep).html().includes(ERROR_MESSAGE)).toEqual(true);
                done();
            });
        }, 1000);
    });
});
