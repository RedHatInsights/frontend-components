import React from 'react';
import { mount } from 'enzyme';
import {
    TextContent,
    Text,
    Popover,
    ClipboardCopy
} from '@patternfly/react-core';

import * as OpCm from '../../../addSourceWizard/hardcodedComponents/openshift/costManagement';

describe('Cost Management OpenShift steps components', () => {
    describe('Prerequisite installations', () => {
        test('description', () => {
            const wrapper = mount(<OpCm.PrerequisiteDescription />);

            expect(wrapper.find(TextContent)).toHaveLength(1);
            expect(wrapper.find(Text)).toHaveLength(2);
        });
        test('OpenShift Cluster Platform text', () => {
            const wrapper = mount(<OpCm.PrerequisiteOCPText />);

            expect(wrapper.find(TextContent)).toHaveLength(1);
            expect(wrapper.find(Text)).toHaveLength(1);
        });
        test('OpenShift Cluster Platform list', () => {
            const wrapper = mount(<OpCm.PrerequisiteOCPList />);

            expect(wrapper.find(TextContent)).toHaveLength(1);
            expect(wrapper.find('ul')).toHaveLength(1);
            expect(wrapper.find('li')).toHaveLength(2);
        });
        test('System text', () => {
            const wrapper = mount(<OpCm.PrerequisiteSystemText />);

            expect(wrapper.find(TextContent)).toHaveLength(1);
            expect(wrapper.find(Text)).toHaveLength(1);
        });
        test('System list', () => {
            const wrapper = mount(<OpCm.PrerequisiteSystemList/>);

            expect(wrapper.find(TextContent)).toHaveLength(1);
            expect(wrapper.find('ul')).toHaveLength(1);
            expect(wrapper.find('li')).toHaveLength(3);
        });
    });
    test('Obtain login description', () => {
        const wrapper = mount(<OpCm.ObtainLoginDescription/>);

        expect(wrapper.find('ol')).toHaveLength(1);
        expect(wrapper.find('li')).toHaveLength(3);
    });
    test('Usage Collector description', () => {
        const wrapper = mount(<OpCm.ConfigureUsageCollector />);

        expect(wrapper.find('ol')).toHaveLength(1);
        expect(wrapper.find('li')).toHaveLength(4);
    });
    test('Cluster identifier label', () => {
        const wrapper = mount(<OpCm.ClusterIdentifierLabel />);

        expect(wrapper.find(Popover)).toHaveLength(1);
    });
    test('Data Collection description', () => {
        const wrapper = mount(<OpCm.DataCollectionDescription />);

        expect(wrapper.find(ClipboardCopy)).toHaveLength(2);
        expect(wrapper.find('ol')).toHaveLength(1);
        expect(wrapper.find('li')).toHaveLength(2);
    });
});
