import React from 'react';
import mount from '../../__mocks__/mount';

import * as OpCm from '../../../addSourceWizard/hardcodedComponents/openshift/costManagement';

describe('Cost Management OpenShift steps components', () => {
    test('Configure Cost Management Operator description', () => {
        const wrapper = mount(<OpCm.ConfigureCostOperator />);

        expect(wrapper.find('ol')).toHaveLength(1);
        expect(wrapper.find('li')).toHaveLength(2);
    });
});
