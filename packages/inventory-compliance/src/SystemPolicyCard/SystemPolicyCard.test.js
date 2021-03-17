import React from 'react';
import { render } from 'enzyme';
import toJson from 'enzyme-to-json';
import SystemPolicyCard from './SystemPolicyCard';
import { IntlProvider } from 'react-intl';

describe('SystemPolicyCard component', () => {
    it('should render policy', () => {
        const currentTime = new Date();
        currentTime.setMonth(currentTime.getMonth() - 6);
        const policy = {
            rulesPassed: 30,
            rulesFailed: 10,
            score: 75,
            lastScanned: currentTime.toISOString(),
            refId: 'xccdf_org.ssgproject.content_profile_pci-dss',
            name: 'PCI-DSS Policy',
            policyType: 'PCI-DSS v3 Control Baseline for Red Hat Enterprise Linux 7',
            compliant: false,
            supported: true,
            ssgVersion: '0.1.45',
            policy: {
                name: 'PCI-DSS Policy'
            }
        };
        const wrapper = render(
            <IntlProvider locale={ navigator.language }>
                <SystemPolicyCard policy={ policy } />
            </IntlProvider>
        );
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
