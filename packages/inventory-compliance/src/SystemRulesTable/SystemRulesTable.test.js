import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import SystemRulesTable from './SystemRulesTable';
import { SortByDirection } from '@patternfly/react-table';
import { TITLE_COLUMN } from '../Constants';
import { remediationsResponse, system, profileRules } from '../Fixtures';
import { columns } from './SystemRulesTable';
import debounce from 'lodash/debounce';

jest.mock('lodash/debounce');
debounce.mockImplementation(fn => fn);
global.fetch = require('jest-fetch-mock');

describe('SystemRulesTable component', () => {
    beforeEach(() => {
        fetch.mockResponse(JSON.stringify(remediationsResponse));
    });

    it('should render', () => {
        const wrapper = shallow(
            <SystemRulesTable
                profileRules={ profileRules }
                loading={ false }
                system={ system }
                columns={ columns }
            />
        );
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render without remediations if prop passed', () => {
        const wrapper = shallow(
            <SystemRulesTable
                remediationsEnabled={ false }
                profileRules={ profileRules }
                loading={ false }
                system={ system }
                columns={ columns }
            />
        );
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render a loading table', () => {
        const wrapper = shallow(
            <SystemRulesTable
                profileRules={ profileRules }
                loading={ true }
                system={ system }
                columns={ columns }
            />
        );
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render filtered rows by policy', async () => {
        let profileRulesWithMultiplePolicies = [
            ...profileRules,
            {
                system: 'aa9c4497-5707-4233-9e9b-1fded5423ef3',
                profile: {
                    id: 'f685817e-69d2-44af-96de-bd5944c4dbd3',
                    refId: 'xccdf_org.ssgproject.content_profile_pci-dss',
                    name: 'PCI-DSS v3 Control Baseline for Red Hat Enterprise Linux 7',
                    policy: {
                        id: 'f685817e-69d2-44af-96de-bd5944c4dbd3'
                    }
                },
                rulesFailed: 0,
                rulesPassed: 1,
                rules: [
                    {
                        title: 'Use direct-lvm with the Device Mapper Storage Driver',
                        severity: 'low',
                        rationale: 'foorationale',
                        refId: 'xccdf_org.ssgproject.content_rule_docker_storage_configured',
                        description: 'foodescription',
                        compliant: true,
                        identifier: JSON.stringify({
                            label: 'CCE-80441-9',
                            system: 'https://nvd.nist.gov/cce/index.cfm'
                        }),
                        references: JSON.stringify([])
                    }
                ]
            }
        ];

        const wrapper = shallow(
            <SystemRulesTable
                profileRules={ profileRulesWithMultiplePolicies }
                loading={ false }
                system={ system }
                itemsPerPage={ 100 }
                columns={ columns }
            />
        );
        const instance = wrapper.instance();
        expect(instance.getRules().length).toEqual(53);
        instance.updatePolicyFilterConfig();
        await instance.onFilterUpdate('policy', [ 'ddf5aefb-ecc8-491a-a2ba-81bf17076361' ]);
        expect(instance.getRules().length).toEqual(52);
        await instance.onFilterUpdate('policy', [ 'f685817e-69d2-44af-96de-bd5944c4dbd3' ]);
        expect(instance.getRules().length).toEqual(1);
    });

    it('should render filtered rows by remediationAvailable', async () => {
        const wrapper = shallow(
            <SystemRulesTable
                profileRules={ profileRules }
                remediationAvailableFilter
                loading={ false }
                system={ system }
                itemsPerPage={ 100 }
                columns={ columns }
            />
        );
        const instance = wrapper.instance();
        expect(instance.getRules().length).toEqual(52);
        await instance.onFilterUpdate('remediationAvailable', [ 'true' ]);
        expect(instance.getRules().length).toEqual(3);
    });

    it('should render filtered rows by severity', async () => {
        const wrapper = shallow(
            <SystemRulesTable
                profileRules={ profileRules }
                loading={ false }
                system={ system }
                itemsPerPage={ 100 }
                columns={ columns }
            />
        );
        const instance = wrapper.instance();
        expect(instance.getRules().length).toEqual(52);
        await instance.onFilterUpdate('severity', [ 'low' ]);
        expect(instance.getRules().length).toEqual(2);
    });

    it('should render filtered rows by multiple severities', async () => {
        const wrapper = shallow(
            <SystemRulesTable
                profileRules={ profileRules }
                loading={ false }
                system={ system }
                itemsPerPage={ 100 }
                columns={ columns }
            />
        );
        const instance = wrapper.instance();
        expect(instance.getRules().length).toEqual(52);
        await instance.onFilterUpdate('severity', [ 'high', 'medium' ]);
        expect(instance.getRules().length).toEqual(50);
    });

    it('should render search results by rule name', async () => {
        const wrapper = shallow(
            <SystemRulesTable
                profileRules={ profileRules }
                loading={ false }
                system={ system }
                itemsPerPage={ 100 }
                columns={ columns }
            />
        );
        const instance = wrapper.instance();
        await instance.onFilterUpdate('name', 'Docker');
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render sorted rows', async () => {
        const wrapper = shallow(
            <SystemRulesTable
                profileRules={ profileRules }
                loading={ false }
                system={ system }
                itemsPerPage={ 100 }
                columns={ columns }
            />
        );
        const instance = wrapper.instance();
        expect(toJson(wrapper)).toMatchSnapshot();

        await instance.onSort(null, TITLE_COLUMN + 2, SortByDirection.asc, { property: 'rule' });
        expect(instance.getRules().length).toEqual(52);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render filtered and search mixed results with the right parent', async () => {
        const wrapper = shallow(
            <SystemRulesTable
                profileRules={ profileRules }
                loading={ false }
                system={ system }
                itemsPerPage={ 50 }
                columns={ columns }
            />
        );
        const instance = wrapper.instance();
        await instance.onFilterUpdate('name', 'Docker');
        await instance.onFilterUpdate('severity', [ 'low' ]);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render search results on any page, returning to page 1', async () => {
        const wrapper = shallow(
            <SystemRulesTable
                profileRules={ profileRules }
                loading={ false }
                system={ system }
                itemsPerPage={ 50 }
                columns={ columns }
            />
        );
        const instance = wrapper.instance();
        await instance.setState({ page: 3 });
        await instance.onFilterUpdate('name', 'Docker');
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    describe('tailoring rules', () => {
        const selectedRefIds = [
            'xccdf_org.ssgproject.content_rule_service_docker_enabled',
            'xccdf_org.ssgproject.content_rule_docker_storage_configured',
            'xccdf_org.ssgproject.content_rule_service_rdisc_disabled'
        ];

        it('should be able to show all selected rules if tailoring is enabled', async () => {
            const wrapper = shallow(
                <SystemRulesTable
                    profileRules={ profileRules }
                    selectedRefIds={ selectedRefIds }
                    loading={ false }
                    system={ system }
                    itemsPerPage={ 50 }
                    selectedFilter
                    tailoringEnabled
                    columns={ [
                        { title: 'Name' },
                        { title: 'Severity' },
                        { title: 'Ansible' }
                    ] }
                />
            );
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('should be able to filter by selected/unselected rules if tailoring is enabled', async () => {
            const wrapper = shallow(
                <SystemRulesTable
                    profileRules={ profileRules }
                    selectedRefIds={ selectedRefIds }
                    loading={ false }
                    system={ system }
                    itemsPerPage={ 50 }
                    selectedFilter
                    tailoringEnabled
                    columns={ [
                        { title: 'Name' },
                        { title: 'Severity' },
                        { title: 'Ansible' }
                    ] }
                />
            );
            const instance = wrapper.instance();
            await instance.onFilterUpdate('selected', [ 'selected' ]);
            expect(toJson(wrapper)).toMatchSnapshot();
            await instance.onFilterUpdate('selected', undefined);
            expect(toJson(wrapper)).toMatchSnapshot();
        });
    });
});
