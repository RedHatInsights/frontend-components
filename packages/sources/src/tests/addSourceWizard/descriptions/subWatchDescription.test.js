/* eslint-disable react/display-name */
import React from 'react';
import {
    Flex,
    FlexItem,
    Stack,
    StackItem,
    Text
} from '@patternfly/react-core';

import SubWatchDescription from '../../../addSourceWizard/descriptions/SubWatchDescription';
import FormRenderer from '../../../sourceFormRenderer/index';
import mount from '../../__mocks__/mount';
import { CheckCircleIcon } from '@patternfly/react-icons';

describe('SubWatchDescription', () => {
    it('Renders correctly when enabled - not super key mode ', () => {
        const wrapper = mount(
            <FormRenderer
                schema={{ fields: [{ name: 'desc', component: 'description', Content: () => <SubWatchDescription id="1" /> }] }}
                initialValues={{ application: { application_type_id: '1' }, source: { app_creation_workflow: 'manual_configuration' } }}
            />
        );

        expect(wrapper.find(CheckCircleIcon)).toHaveLength(3);
        expect(wrapper.find(Text)).toHaveLength(6);
        expect(wrapper.find(Stack)).toHaveLength(1);
        expect(wrapper.find(StackItem)).toHaveLength(3);
        expect(wrapper.find(Flex)).toHaveLength(3);
        expect(wrapper.find(FlexItem)).toHaveLength(6);

        expect(wrapper.find(CheckCircleIcon).first().props().fill).toEqual('#3E8635');
    });

    it('Renders correctly when enabled - super key mode', () => {
        const wrapper = mount(
            <FormRenderer
                schema={{ fields: [{ name: 'desc', component: 'description', Content: () => <SubWatchDescription id="1" /> }] }}
                initialValues={{ applications: [ '1' ], source: { app_creation_workflow: 'account_authorization' } }}
            />
        );
        expect(wrapper.find(CheckCircleIcon).first().props().fill).toEqual('#3E8635');
    });

    it('Renders correctly when not enabled - not super key mode', () => {
        const wrapper = mount(
            <FormRenderer
                schema={{ fields: [{ name: 'desc', component: 'description', Content: () => <SubWatchDescription id="1" /> }] }}
                initialValues={{ application: { application_type_id: '2' }, source: { app_creation_workflow: 'manual_configuration' } }}
            />
        );

        expect(wrapper.find(CheckCircleIcon).first().props().fill).toEqual('#6A6E73');
    });

    it('Renders correctly when not enabled - super key mode', () => {
        const wrapper = mount(
            <FormRenderer
                schema={{ fields: [{ name: 'desc', component: 'description', Content: () => <SubWatchDescription id="1" /> }] }}
                initialValues={{ applications: [], source: { app_creation_workflow: 'account_authorization' } }}
            />
        );

        expect(wrapper.find(CheckCircleIcon).first().props().fill).toEqual('#6A6E73');
    });
});
