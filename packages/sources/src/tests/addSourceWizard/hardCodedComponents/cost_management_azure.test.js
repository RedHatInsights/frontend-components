import React from 'react';
import { mount } from 'enzyme';
import {
    TextContent,
    Text,
    Popover,
    ClipboardCopy
} from '@patternfly/react-core';

import * as Cm from '../../../addSourceWizard/hardcodedComponents/azure/costManagement';

describe('Cost Management Azure steps components', () => {
    test('Configure Resource Group and Storage Account description', () => {
        const wrapper = mount(<Cm.ConfigureResourceGroupAndStorageAccount />);

        expect(wrapper.find(Text)).toHaveLength(2);
    });
    test('Service Principal description', () => {
        const wrapper = mount(<Cm.ServicePrincipalDescription />);

        expect(wrapper.find(TextContent)).toHaveLength(1);
        expect(wrapper.find(ClipboardCopy)).toHaveLength(1);
    });
    test('Create Active Directory description', () => {
        const wrapper = mount(<Cm.CreateActiveDirectory />);

        expect(wrapper.find(TextContent)).toHaveLength(1);
        expect(wrapper.find(Text)).toHaveLength(1);
        expect(wrapper.find(ClipboardCopy)).toHaveLength(1);
    });
    test('Export Schedule description', () => {
        const wrapper = mount(<Cm.ExportSchedule />);

        expect(wrapper.find('div.list-align-left')).toHaveLength(1);
        expect(wrapper.find('dl.export-table')).toHaveLength(1);
    });
});
