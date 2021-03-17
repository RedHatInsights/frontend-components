/* eslint-disable camelcase */
import React from 'react';
import FormRenderer from '@data-driven-forms/react-form-renderer/dist/esm/form-renderer';
import FormTemplate from '@data-driven-forms/pf4-component-mapper/dist/esm/form-template';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import ReviewActions from '../../steps/reviewActions';
import { reviewActionsFields } from '../../RemediationWizard/schema';
import { EXISTING_PLAYBOOK, EXISTING_PLAYBOOK_SELECTED } from '../../utils';
import { BodyRow } from '@patternfly/react-table/dist/js/components/Table/base';
import { remediationWizardTestData } from '../testData';

const RendererWrapper = (props) => (
    <FormRenderer
        onSubmit={() => {}}
        FormTemplate={FormTemplate}
        componentMapper={{
            'review-actions': {
                component: ReviewActions,
                issues: remediationWizardTestData.issues,
                issuesMultiple: remediationWizardTestData.issuesMultiple
            }
        }}
        initialValues={{
            [EXISTING_PLAYBOOK_SELECTED]: true,
            [EXISTING_PLAYBOOK]: {
                auto_reboot: true,
                id: 'id',
                issues: [{
                    id: 'test'
                }],
                name: 'test',
                needs_reboot: false
            }
        }}
        schema={{ fields: [] }}
        {...props}
    />
);

const createSchema = () => ({
    fields: reviewActionsFields
});

describe('ReviewActions', () => {

    let onSubmit;

    beforeEach(() => {
        onSubmit = jest.fn();
    });

    it('should render correctly', async () => {
        let wrapper;
        await act(async() => {
            wrapper = mount(<RendererWrapper schema={createSchema({})} />);
        });
        expect(wrapper.find('input[type="radio"]')).toHaveLength(2);
        expect(wrapper.find('table')).toHaveLength(1);
        expect(wrapper.find(BodyRow)).toHaveLength(1);
    });

    it('should sort table & submit review option', async () => {
        let wrapper;
        await act(async() => {
            wrapper = mount(<RendererWrapper schema={createSchema({})} onSubmit={onSubmit}/>);
        });
        wrapper.find('button[className="pf-c-table__button"]').last().simulate('click');
        wrapper.find('input[type="radio"]').first().simulate('change', {
            target: { checked: true } });
        wrapper.update();
        wrapper.find('Form').simulate('submit');
        expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    it('should submit accept option', async () => {
        let wrapper;
        await act(async() => {
            wrapper = mount(<RendererWrapper schema={createSchema({})} onSubmit={onSubmit}/>);
        });
        wrapper.find('input[type="radio"]').last().simulate('change', {
            target: { checked: true } });
        wrapper.update();
        wrapper.find('Form').simulate('submit');
        expect(onSubmit).toHaveBeenCalledTimes(1);
    });
});
