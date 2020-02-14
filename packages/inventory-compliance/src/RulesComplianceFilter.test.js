import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import RulesComplianceFilter from './RulesComplianceFilter';

describe('RulesComplianceFilter component', () => {
    const policies = [
        {
            refId: 'xccdf_org.ssgproject.content_profile_pci-dss',
            name: 'PCI-DSS v3 Control Baseline for Red Hat Enterprise Linux 7'
        },
        {
            refId: 'xccdf_org.ssgproject.content_profile_pci-dss',
            name: 'PCI-DSS v3 Control Baseline for Red Hat Enterprise Linux 8'
        }
    ];

    it('should render filter', () => {
        const wrapper = shallow(
            <RulesComplianceFilter availablePolicies={ policies } />
        );
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should not allow to filter if there is only one policy', () => {
        const wrapper = shallow(
            <RulesComplianceFilter availablePolicies={ [ policies[0] ] } />
        );
        wrapper.instance();
        expect(wrapper.state('filterCategories').length).toEqual(2);
        expect(wrapper.state('filterCategories')[0].title).toEqual('Passed');
        expect(wrapper.state('filterCategories')[1].title).toEqual('Severity');
    });

    it('should not display the "Passed" filter if disabled', () => {
        const wrapper = shallow(
            <RulesComplianceFilter
                showPassFailFilter={ false }
            />
        );
        wrapper.instance();
        expect(wrapper.state('filterCategories').length).toEqual(1);
        expect(wrapper.state('filterCategories')[0].title).toEqual('Severity');
    });

    it('should allow to add and remove filters', () => {
        const wrapper = shallow(
            <RulesComplianceFilter availablePolicies={ policies } />
        );
        const instance = wrapper.instance();
        instance.addFilter('hidePassed', true);
        expect(wrapper.state('hidePassed')).toEqual(true);
        instance.addFilter('severity', 'medium');
        instance.addFilter('severity', 'low');
        expect(wrapper.state('hidePassed')).toEqual(true);
        expect(wrapper.state('severity')).toEqual([ 'medium', 'low' ]);
        instance.removeFilter('severity', 'low');
        expect(wrapper.state('severity')).toEqual([ 'medium' ]);
        instance.addFilter('policy', policies[0].name);
        instance.addFilter('policy', policies[1].name);
        expect(wrapper.state('policy')).toEqual([ policies[0].name, policies[1].name ]);
        instance.removeFilter('policy', policies[0].name);
        expect(wrapper.state('policy')).toEqual([ policies[1].name ]);
        instance.removeFilter('hidePassed', false);
        expect(wrapper.state('hidePassed')).toEqual(false);
    });
});
