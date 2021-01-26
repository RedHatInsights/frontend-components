import React from 'react';
import {
    TextContent,
    Text,
    ClipboardCopy
} from '@patternfly/react-core';

import * as Cm from '../../../addSourceWizard/hardcodedComponents/azure/costManagement';
import RenderContext from '@data-driven-forms/react-form-renderer/dist/cjs/renderer-context';
import mount from '../../__mocks__/mount';

describe('Cost Management Azure steps components', () => {
    test('Configure Resource Group and Storage Account description', () => {
        const wrapper = mount(<Cm.ConfigureResourceGroupAndStorageAccount />);

        expect(wrapper.find(Text)).toHaveLength(3);
    });
    test('Subscription ID description', () => {
        const wrapper = mount(<Cm.SubscriptionID />);

        expect(wrapper.find(TextContent)).toHaveLength(1);
        expect(wrapper.find(ClipboardCopy)).toHaveLength(1);
    });
    test('Configure Roles description', () => {
        const wrapper = mount(<Cm.ConfigureRolesDescription />);

        expect(wrapper.find(TextContent)).toHaveLength(1);
        expect(wrapper.find(Text)).toHaveLength(3);
        expect(wrapper.find(ClipboardCopy)).toHaveLength(1);
    });
    test('Read Role description', () => {
        const wrapper = mount(
            <RenderContext.Provider value={{ formOptions: { getState: () => ({ values: { application: { extra: { subscription_id: 'my-sub-id-1' } } } }) } }}>
                <Cm.ReaderRoleDescription />
            </RenderContext.Provider>
        );
        expect(wrapper.find(TextContent)).toHaveLength(1);
        expect(wrapper.find(Text)).toHaveLength(1);
        expect(wrapper.find(ClipboardCopy).props().children).toMatch(/my-sub-id-1/);
    });
    test('Export Schedule description', () => {
        const wrapper = mount(<Cm.ExportSchedule />);

        expect(wrapper.find('div.list-align-left')).toHaveLength(1);
        expect(wrapper.find('dl.export-table')).toHaveLength(1);
    });
});
