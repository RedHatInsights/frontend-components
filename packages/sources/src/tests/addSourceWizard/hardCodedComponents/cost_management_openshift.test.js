import React from 'react';
import { mount } from 'enzyme';
import {
    TextContent,
    Text,
    Popover
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
    });
    test('Configure Cost Management Operator description', () => {
        const wrapper = mount(<OpCm.ConfigureCostOperator />);

        expect(wrapper.find('ol')).toHaveLength(1);
        expect(wrapper.find('li')).toHaveLength(3);
    });
    test('Cluster identifier label', () => {
        const wrapper = mount(<OpCm.ClusterIdentifierLabel />);

        expect(wrapper.find(Popover)).toHaveLength(1);
    });
});
