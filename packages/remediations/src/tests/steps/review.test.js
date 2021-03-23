/* eslint-disable camelcase */
import React from 'react';
import FormRenderer from '@data-driven-forms/react-form-renderer/dist/esm/form-renderer';
import FormTemplate from '@data-driven-forms/pf4-component-mapper/dist/esm/form-template';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { AUTO_REBOOT } from '../../utils';
import Review from '../../steps/review';
import { BodyRow } from '@patternfly/react-table/dist/js/components/Table/base';
import { remediationWizardTestData } from '../testData';

const RendererWrapper = (props) => (
    <FormRenderer
        onSubmit={() => {}}
        FormTemplate={FormTemplate}
        componentMapper={{
            review: {
                component: Review,
                data: {
                    issues: [
                        {
                            id: 'testId'
                        },
                        {
                            id: 'testId2'
                        }
                    ],
                    systems: remediationWizardTestData.systems
                },
                issuesById: remediationWizardTestData.issuesById,
                resolutions: remediationWizardTestData.resolutions
            }
        }}
        schema={{ fields: [] }}
        subscription={{ values: true }}
        {...props}
    />
);

const createSchema = () => ({
    fields: [
        {
            name: AUTO_REBOOT,
            component: 'review'
        }
    ]
});

describe('ReviewActions', () => {

    let initialProps;
    let onSubmit;

    beforeEach(() => {
        initialProps = {
            data: {
                issues: remediationWizardTestData.issues,
                systems: remediationWizardTestData.systems
            }
        };
        onSubmit = jest.fn();
    });

    it('should render correctly', async () => {
        let wrapper;
        await act(async() => {
            wrapper = mount(<RendererWrapper schema={createSchema({})} {...initialProps} />);
        });
        wrapper.update();
        expect(wrapper.find('Form')).toHaveLength(1);
        expect(wrapper.find('table')).toHaveLength(1);
        expect(wrapper.find(BodyRow)).toHaveLength(2);
        expect(wrapper.find('button')).toHaveLength(6);
    });

    it('should change autoreboot correctly', async () => {
        let wrapper;
        await act(async() => {
            wrapper = mount(<RendererWrapper schema={createSchema({})} {...initialProps} />);
        });
        wrapper.update();
        expect(wrapper.find('Button[variant="link"]').props().children).toEqual([ 'Turn ', 'off', ' autoreboot' ]);
        wrapper.find('Button[variant="link"]').simulate('click');
        expect(wrapper.find('Button[variant="link"]').props().children).toEqual([ 'Turn ', 'on', ' autoreboot' ]);
    });

    it('should sort records correctly', async () => {
        let wrapper;
        await act(async() => {
            wrapper = mount(<RendererWrapper schema={createSchema({})} {...initialProps} />);
        });
        wrapper.update();
        expect(wrapper.find('td').first().props().children).toEqual('test_description');
        wrapper.find('button[className="pf-c-table__button"]').first().simulate('click');
        wrapper.update();
        expect(wrapper.find('td').first().props().children).toEqual('description');
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
