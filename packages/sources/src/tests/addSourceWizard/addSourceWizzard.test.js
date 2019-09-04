import React from 'react';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Button } from '@patternfly/react-core';

import { AddSourceWizard } from '../../addSourceWizard/index';
import FormRenderer from '../../sourceFormRenderer/index';
import Modal from '../../addSourceWizard/SourceAddModal';
import FinalWizard from '../../addSourceWizard/FinalWizard';
import FinishedStep from '../../addSourceWizard/steps/FinishedStep';
import ErroredStep from '../../addSourceWizard/steps/ErroredStep';

import sourceTypes from '../helpers/sourceTypes';
import applicationTypes from '../helpers/applicationTypes';
import * as dependency from '../../api/index';

describe('AddSourceButton', () => {
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
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find(Modal).length).toBe(1);
    });

    it('renders correctly without sourceTypes', () => {
        const wrapper = shallow(<AddSourceWizard { ...initialProps } sourceTypes={ undefined }/>);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('show finished step after filling the form', () => {
        dependency.doCreateSource = jest.fn(() => new Promise((resolve) => resolve('ok')));

        const wrapper = mount(<AddSourceWizard { ...initialProps }/>);
        const form = wrapper.find(FormRenderer).children().children().instance().form;

        form.change('source.name', 'nameee');
        form.change('source_type', 'openshift');
        form.submit().then(() => {
            wrapper.update();
            expect(wrapper.find(FinalWizard).length).toBe(1);
            expect(wrapper.find(FinishedStep).length).toBe(1);
            expect(wrapper.find(ErroredStep).length).toBe(0);
        });
    });

    it('show pass created source to afterSubmit function', () => {
        const afterSubmitMock = jest.fn();
        dependency.doCreateSource = jest.fn(() => new Promise((resolve) => resolve({ name: 'source' })));

        const wrapper = mount(<AddSourceWizard { ...initialProps } afterSubmit={ afterSubmitMock }/>);
        const form = wrapper.find(FormRenderer).children().children().instance().form;

        form.change('source.name', 'nameee');
        form.change('source_type', 'openshift');
        form.submit().then(() => {
            wrapper.update();
            wrapper.find(Button).at(0).simulate('click');

            expect(afterSubmitMock).toHaveBeenCalledWith({ name: 'source' });
        });
    });

    it('show error step after failing the form', () => {
        dependency.doCreateSource = jest.fn(() => new Promise((_resolve, reject) => reject('fail')));

        const wrapper = mount(<AddSourceWizard { ...initialProps }/>);
        const form = wrapper.find(FormRenderer).children().children().instance().form;

        form.change('source.name', 'nameee');
        form.change('source_type', 'openshift');
        form.submit().then(() => {
            wrapper.update();
            expect(wrapper.find(FinalWizard).length).toBe(1);
            expect(wrapper.find(FinishedStep).length).toBe(0);
            expect(wrapper.find(ErroredStep).length).toBe(1);
        });
    });
});
