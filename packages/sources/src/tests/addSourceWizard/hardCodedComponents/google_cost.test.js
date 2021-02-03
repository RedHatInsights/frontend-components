import React from 'react';
import { act } from 'react-dom/test-utils';
import { Text, TextContent, TextList, TextListItem, ClipboardCopy } from '@patternfly/react-core';
import * as api from '../../../api/index';

import * as Cm from '../../../addSourceWizard/hardcodedComponents/gcp/costManagement';
import mount from '../../__mocks__/mount';
import FormRenderer from '../../../sourceFormRenderer';

describe('Cost Management Google steps components', () => {
    it('Project', () => {
        const wrapper = mount(<Cm.Project />);

        expect(wrapper.find(TextContent)).toHaveLength(1);
        expect(wrapper.find(Text)).toHaveLength(1);
    });

    describe('Assign access', () => {
        it('successfully loads data', async () => {
            const email = 'super-google-email@gmail.com';

            api.getSourcesApi = () => ({
                getGoogleAccount: () => Promise.resolve({
                    data: [
                        { payload: email }
                    ]
                })
            });

            let wrapper;
            await act(async () => {
                wrapper = mount(<Cm.AssignAccess />);
            });

            expect(wrapper.find(ClipboardCopy).props().children).toEqual('Loading account address...');

            wrapper.update();

            expect(wrapper.find(TextContent)).toHaveLength(1);
            expect(wrapper.find(Text)).toHaveLength(1);
            expect(wrapper.find(TextList)).toHaveLength(1);
            expect(wrapper.find(TextListItem)).toHaveLength(4);
            expect(wrapper.find(ClipboardCopy).props().children).toEqual(email);
        });

        it('catches errors', async () => {
            const _cons = console.error;
            console.error = jest.fn();

            const error = 'super-google-error';

            api.getSourcesApi = () => ({
                getGoogleAccount: () => Promise.reject(error)
            });

            let wrapper;

            await act(async () => {
                wrapper = mount(<Cm.AssignAccess />);
            });

            expect(wrapper.find(ClipboardCopy).props().children).toEqual('Loading account address...');

            wrapper.update();

            expect(wrapper.find(ClipboardCopy).props().children).toEqual('There is an error with loading of the account address. Please go back and return to this step.');
            expect(console.error).toHaveBeenCalledWith(error);

            console.error = _cons;
        });
    });

    it('Dataset', () => {
        const wrapper = mount(<FormRenderer
            onSubmit={jest.fn()}
            schema={{ fields: [{
                name: 'field',
                component: 'description',
                Content: Cm.Dataset
            }] }}
            initialValues={{
                authentication: {
                    username: 'some-project-id'
                }
            }}
        />);

        expect(wrapper.find(TextContent)).toHaveLength(1);
        expect(wrapper.find(Text)).toHaveLength(1);
        expect(wrapper.find(TextList)).toHaveLength(1);
        expect(wrapper.find(TextListItem)).toHaveLength(4);

        expect(wrapper.find(TextListItem).first().text()).toEqual('In the BigQuery console, select your project (some-project-id) from the navigation menu.');
    });

    it('Billing export', () => {
        const wrapper = mount(<Cm.BillingExport />);

        expect(wrapper.find(TextContent)).toHaveLength(1);
        expect(wrapper.find(Text)).toHaveLength(1);
        expect(wrapper.find(TextList)).toHaveLength(1);
        expect(wrapper.find(TextListItem)).toHaveLength(5);
    });

    it('IAM Role', () => {
        const wrapper = mount(<Cm.IAMRole />);

        expect(wrapper.find(TextContent)).toHaveLength(1);
        expect(wrapper.find(Text)).toHaveLength(1);
        expect(wrapper.find(TextList)).toHaveLength(2);
        expect(wrapper.find(TextListItem)).toHaveLength(8);
    });
});
