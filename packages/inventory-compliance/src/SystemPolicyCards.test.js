import React from 'react';
import SystemPolicyCards from './SystemPolicyCards';
import { IntlProvider } from 'react-intl';
import renderer from 'react-test-renderer';

describe('SystemPolicyCards component', () => {
    const policies = [{
        rulesPassed: 30,
        rulesFailed: 10,
        lastScanned: '2019-03-06T06:20:13Z',
        refId: 'xccdf_org.ssgproject.content_profile_pci-dss',
        name: 'PCI-DSS v3 Control Baseline for Red Hat Enterprise Linux 7',
        compliant: false
    }, {
        rulesPassed: 0,
        rulesFailed: 0,
        lastScanned: null,
        refId: 'xccdf_org.ssgproject.content_profile_pci-dss2',
        name: 'PCI-DSS v3 Control Baseline for Red Hat Enterprise Linux 7 2',
        compliant: false
    }];

    it('should render loading state', () => {
        const component = renderer.create(
            <IntlProvider locale={ navigator.language }>
                <SystemPolicyCards policies={ policies } loading={ true } />
            </IntlProvider>
        );
        expect(component.toJSON()).toMatchSnapshot();
    });

    it('should render real table', () => {
        const component = renderer.create(
            <IntlProvider locale={ navigator.language }>
                <SystemPolicyCards policies={ policies } loading={ false } />
            </IntlProvider>
        );
        expect(component.toJSON()).toMatchSnapshot();
    });
});
