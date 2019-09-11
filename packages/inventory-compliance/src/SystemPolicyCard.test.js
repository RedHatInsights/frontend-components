import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import SystemPolicyCard from './SystemPolicyCard';
import { IntlProvider } from 'react-intl';

describe('SystemPolicyCard component', () => {
    it('should render', () => {
        const policy = {
            rulesPassed: 30,
            rulesFailed: 10,
            lastScanned: '2019-03-06T06:20:13Z',
            refId: 'xccdf_org.ssgproject.content_profile_pci-dss',
            name: 'PCI-DSS v3 Control Baseline for Red Hat Enterprise Linux 7',
            compliant: false
        };
        const wrapper = mount(
            <IntlProvider locale={ navigator.language }>
                <SystemPolicyCard policy={ policy } />
            </IntlProvider>
        );
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
