import React from 'react';
import { mount } from 'enzyme';
import {
    TextContent,
    Text,
    Popover
} from '@patternfly/react-core';

import * as OpCm from '../../../addSourceWizard/hardcodedComponents/openshift/costManagement';

describe('Cost Management OpenShift steps components', () => {
    test('Configure Cost Management Operator description', () => {
        const wrapper = mount(<OpCm.ConfigureCostOperator />);

        expect(wrapper.find('ol')).toHaveLength(1);
        expect(wrapper.find('li')).toHaveLength(2);
    });
    test('Cluster identifier label', () => {
        const wrapper = mount(<OpCm.ClusterIdentifierLabel />);

        expect(wrapper.find(Popover)).toHaveLength(1);
    });
});
