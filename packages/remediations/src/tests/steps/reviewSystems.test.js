/* eslint-disable camelcase */
import React from 'react';
import FormRenderer from '@data-driven-forms/react-form-renderer/dist/esm/form-renderer';
import FormTemplate from '@data-driven-forms/pf4-component-mapper/dist/esm/form-template';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { SYSTEMS } from '../../utils';
import { remediationWizardTestData } from '../testData';
import ReviewSystems from '../../steps/reviewSystems';

jest.mock('@redhat-cloud-services/frontend-components/Inventory', () => ({
    __esModule: true,
    // eslint-disable-next-line react/display-name
    InventoryTable: () => <div>Inventory</div>
}));

const RendererWrapper = (props) => (
    <FormRenderer
        onSubmit={() => {}}
        FormTemplate={FormTemplate}
        componentMapper={{
            'review-systems': {
                component: ReviewSystems,
                issues: remediationWizardTestData.issues,
                systems: remediationWizardTestData.systems
            }
        }}
        schema={{ fields: [] }}
        {...props}
    />
);

const createSchema = () => ({
    fields: [{
        name: SYSTEMS,
        component: 'review-systems'
    }]
});

describe('ReviewSystems', () => {

    it('should render correctly', async () => {
        let wrapper;
        await act(async() => {
            wrapper = mount(<RendererWrapper schema={createSchema({})} />);
        });
        expect(wrapper.find(ReviewSystems)).toHaveLength(1);
        expect(wrapper.find('Button[type="submit"]')).toHaveLength(2);
    });
});
