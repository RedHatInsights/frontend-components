import React from 'react';
import mount from '../../__mocks__/mount';

import * as OpCm from '../../../addSourceWizard/hardcodedComponents/openshift/costManagement';

describe('Cost Management OpenShift steps components', () => {
    test('Configure Cost Management Operator description', () => {
        const wrapper = mount(<OpCm.ConfigureCostOperator />);

        expect(wrapper.find('p')).toHaveLength(4);
    });
});
