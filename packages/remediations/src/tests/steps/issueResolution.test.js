/* eslint-disable camelcase */
import React from 'react';
import FormRenderer from '@data-driven-forms/react-form-renderer/dist/esm/form-renderer';
import FormTemplate from '@data-driven-forms/pf4-component-mapper/dist/esm/form-template';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import IssueResolution from '../../steps/issueResolution';
import { SELECTED_RESOLUTIONS } from '../../utils';
import { Tile } from '@patternfly/react-core';
import { remediationWizardTestData } from '../testData';

const RendererWrapper = (props) => (
    <FormRenderer
        onSubmit={() => {}}
        FormTemplate={FormTemplate}
        componentMapper={{
            'issue-resolution': {
                component: IssueResolution,
                issues: remediationWizardTestData.issues,
                systems: remediationWizardTestData.systems,
                resolutions: remediationWizardTestData.resolutions
            }
        }}
        initialValues={{
            [SELECTED_RESOLUTIONS]: {
                testId: 'test2'
            }
        }}
        schema={{ fields: [] }}
        {...props}
        subscription={{ values: true }}
    />
);

const createSchema = () => ({
    fields: [
        {
            name: 'test',
            component: 'issue-resolution',
            issue: {
                id: 'testId',
                description: 'description'
            }
        }
    ]
});

describe('ReviewActions', () => {

    let initialProps;
    let onSubmit;

    beforeEach(() => {
        initialProps = {
            issues: remediationWizardTestData.issues
        };
        onSubmit = jest.fn();
    });

    it('should render resolutions correctly', async () => {
        let wrapper;
        await act(async() => {
            wrapper = mount(<RendererWrapper schema={createSchema({})} {...initialProps} />);
        });
        wrapper.update();
        expect(wrapper.find('Tile[isSelected=true]')).toHaveLength(1);
        expect(wrapper.find('Tile[isSelected=false]')).toHaveLength(1);
    });

    it('should select another resolution correctly', async () => {
        let wrapper;
        await act(async() => {
            wrapper = mount(<RendererWrapper schema={createSchema({})} {...initialProps} />);
        });
        wrapper.update();
        expect(wrapper.find(Tile).first().props().isSelected).toEqual(false);
        expect(wrapper.find(Tile).last().props().isSelected).toEqual(true);
        wrapper.find(Tile).first().simulate('click');
        wrapper.update();
        expect(wrapper.find(Tile).first().props().isSelected).toEqual(true);
        expect(wrapper.find(Tile).last().props().isSelected).toEqual(false);
    });

    it('should submit the form', async () => {
        let wrapper;
        await act(async() => {
            wrapper = mount(<RendererWrapper schema={createSchema({})} {...initialProps} onSubmit={onSubmit}/>);
        });
        wrapper.update();
        wrapper.find('Form').simulate('submit');
        expect(onSubmit).toHaveBeenCalledTimes(1);
    });
});
