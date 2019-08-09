import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import SystemPolicyCards from './SystemPolicyCards';
import { IntlProvider } from 'react-intl';

describe('SystemPolicyCards component', () => {
    const policies = [{
        rulesPassed: 30,
        rulesFailed: 10,
        lastScanned: '2019-03-06T06:20:13Z',
        refId: 'xccdf_org.ssgproject.content_profile_pci-dss',
        name: 'PCI-DSS v3 Control Baseline for Red Hat Enterprise Linux 7',
        compliant: false
    }];

    it('should render loading state', () => {
        const wrapper = shallow(
            <IntlProvider locale={ navigator.language }>
                <SystemPolicyCards policies={ policies } loading={ true } />
            </IntlProvider>
        );
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render real table', () => {
        const wrapper = shallow(
            <IntlProvider locale={ navigator.language }>
                <SystemPolicyCards policies={ policies } loading={ false } />
            </IntlProvider>
        );
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
