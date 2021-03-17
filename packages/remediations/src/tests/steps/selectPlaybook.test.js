/* eslint-disable camelcase */
import React from 'react';
import FormRenderer from '@data-driven-forms/react-form-renderer/dist/esm/form-renderer';
import FormTemplate from '@data-driven-forms/pf4-component-mapper/dist/esm/form-template';
import { mount } from 'enzyme';
import * as dependency from '../../api/index';
import SelectPlaybook from '../../steps/selectPlaybook';
import TextField from '@data-driven-forms/pf4-component-mapper/dist/esm/text-field';
import componentTypes from '@data-driven-forms/react-form-renderer/dist/esm/component-types';
import { act } from 'react-dom/test-utils';
import { selectPlaybookFields } from '../../RemediationWizard/schema';
import { remediationWizardTestData } from '../testData';

const RendererWrapper = (props) => (
    <FormRenderer
        onSubmit={() => {}}
        FormTemplate={FormTemplate}
        componentMapper={{
            [componentTypes.TEXT_FIELD]: TextField,
            'select-playbook': {
                component: SelectPlaybook,
                issues: remediationWizardTestData.issues,
                systems: remediationWizardTestData.systems
            }
        }}
        schema={{ fields: [] }}
        {...props}
    />
);

const createSchema = () => ({
    fields: selectPlaybookFields
});

describe('SelectPlaybook', () => {

    let initialProps;
    let onSubmit;

    beforeEach(() => {
        onSubmit = jest.fn();
    });

    it('should render correctly without remediations', async () => {
        dependency.getRemediations = jest.fn(() => new Promise((resolve) => resolve({ data: [{ id: 'remediationId', name: 'someName' }] })));
        let wrapper;
        await act(async() => {
            wrapper = mount(<RendererWrapper schema={createSchema({})} {...initialProps} />);
        });
        expect(wrapper.find('input[type="radio"]')).toHaveLength(2);
        expect(wrapper.find('input[type="text"]')).toHaveLength(3);
        expect(wrapper.find('FormSelect')).toHaveLength(0);
        expect(wrapper.find('Skeleton')).toHaveLength(1);

    });

    it('should render correctly with remediations', async () => {
        dependency.getRemediations = jest.fn(() => new Promise((resolve) => resolve({ data: [{ id: 'remediationId', name: 'name' }] })));
        dependency.getRemediation = jest.fn(() => new Promise((resolve) => resolve({ id: 'remediationId', name: 'name' })));

        let wrapper;
        await act(async() => {
            wrapper = mount(<RendererWrapper schema={createSchema({})} {...initialProps} />);
        });
        wrapper.update();
        expect(wrapper.find('input[type="radio"]')).toHaveLength(2);
        expect(wrapper.find('input[type="text"]')).toHaveLength(3);
        expect(wrapper.find('FormSelect')).toHaveLength(1);
        expect(wrapper.find('Skeleton')).toHaveLength(0);

    });

    it('should not submit empty', async () => {
        dependency.getRemediations = jest.fn(() => new Promise((resolve) => resolve({ data: [{ id: 'remediationId', name: 'name' }] })));
        dependency.getRemediation = jest.fn(() => new Promise((resolve) => resolve({ id: 'remediationId', name: 'name' })));
        let wrapper;
        await act(async() => {
            wrapper = mount(<RendererWrapper schema={createSchema({})} {...initialProps} onSubmit={onSubmit} />);
        });
        wrapper.find('Form').simulate('submit');
        expect(onSubmit).toHaveBeenCalledTimes(0);
    });

    it('should submit new playbook', async () => {
        dependency.getRemediations = jest.fn(() => new Promise((resolve) => resolve({ data: [{ id: 'remediationId', name: 'name' }] })));
        dependency.getRemediation = jest.fn(() => new Promise((resolve) => resolve({ id: 'remediationId', name: 'name' })));
        let wrapper;
        await act(async() => {
            wrapper = mount(<RendererWrapper schema={createSchema({})} {...initialProps} onSubmit={onSubmit} />);
        });
        wrapper.find('input[type="radio"]').last().simulate('change');
        wrapper.find('input[type="text"]').first().instance().value = 'new';
        wrapper.find('input[type="text"]').first().simulate('change');
        wrapper.find('Form').simulate('submit');
        expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    it('should submit existing playbook', async () => {
        dependency.getRemediations = jest.fn(() => new Promise((resolve) => resolve({ data: [{ id: 'remediationId', name: 'name' }] })));
        dependency.getRemediation = jest.fn(() => new Promise((resolve) => resolve({ id: 'remediationId', name: 'name' })));
        let wrapper;
        await act(async() => {
            wrapper = mount(<RendererWrapper schema={createSchema({})} {...initialProps} onSubmit={onSubmit} />);
        });
        wrapper.find('input[type="radio"]').first().simulate('change');
        await act(async() => {
            wrapper.find('FormSelect').simulate('change', {
                target: { value: 'item1', name: 'item1' } });
        });
        wrapper.find('Form').simulate('submit');
        expect(onSubmit).toHaveBeenCalledTimes(1);
    });
});
