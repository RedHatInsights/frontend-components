import React from 'react';
import SystemPolicyCards from './SystemPolicyCards';
import { IntlProvider } from 'react-intl';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
jest.mock('react-content-loader', () => ({
    Instagram: 'Instagram'
}));

describe('SystemPolicyCards component', () => {
    const policies = [{
        rulesPassed: 30,
        rulesFailed: 10,
        score: 75,
        lastScanned: '2019-03-06T06:20:13Z',
        refId: 'xccdf_org.ssgproject.content_profile_pci-dss',
        name: 'PCI-DSS v3 Control Baseline for Red Hat Enterprise Linux 7',
        compliant: false,
        supported: true,
        ssgVersion: '0.1.45'
    }, {
        rulesPassed: 0,
        rulesFailed: 0,
        score: 0,
        lastScanned: null,
        refId: 'xccdf_org.ssgproject.content_profile_pci-dss2',
        name: 'PCI-DSS v3 Control Baseline for Red Hat Enterprise Linux 7 2',
        compliant: false,
        supported: true,
        ssgVersion: '0.1.45'
    }];

    it('should render loading state', () => {
        const wrappper = mount(
            <IntlProvider locale={ navigator.language }>
                <SystemPolicyCards policies={ policies } loading={ true } />
            </IntlProvider>
        );
        expect(toJson(wrappper)).toMatchSnapshot();
    });

    it('should render real table', () => {
        const wrappper = mount(
            <IntlProvider locale={ navigator.language }>
                <SystemPolicyCards policies={ policies } loading={ false } />
            </IntlProvider>
        );
        expect(toJson(wrappper)).toMatchSnapshot();
    });
});
