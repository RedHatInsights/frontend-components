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
        dependency.doCreateSource = jest.fn(() => new Promise((resolve) => resolve('ok')));
        dependency.findSource = jest.fn(() => Promise.resolve({ data: { sources: [] } }));

        const wrapper = mount(<AddSourceWizard { ...initialProps }/>);
        const form = wrapper.find(FormRenderer).children().children().instance().form;

        form.change('source.name', 'nameee');
        form.change('source_type', 'openshift');

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
        dependency.doCreateSource = jest.fn(() => new Promise((resolve) => resolve({ name: 'source' })));
        dependency.findSource = jest.fn(() => Promise.resolve({ data: { sources: [] } }));

        const wrapper = mount(<AddSourceWizard { ...initialProps } afterSuccess={ afterSubmitMock }/>);
        const form = wrapper.find(FormRenderer).children().children().instance().form;

        form.change('source.name', 'nameee');
        form.change('source_type', 'openshift');

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

    it('show error step after failing the form', (done) => {
        dependency.doCreateSource = jest.fn(() => new Promise((_resolve, reject) => reject('fail')));

        const wrapper = mount(<AddSourceWizard { ...initialProps }/>);
        const form = wrapper.find(FormRenderer).children().children().instance().form;

        form.change('source.name', 'nameee');
        form.change('source_type', 'openshift');

        setTimeout(() => {
            form.submit().then(() => {
                wrapper.update();
                expect(wrapper.find(FinalWizard)).toHaveLength(1);
                expect(wrapper.find(FinishedStep)).toHaveLength(0);
                expect(wrapper.find(ErroredStep)).toHaveLength(1);
                done();
            });
        }, 1000);
    });
});
