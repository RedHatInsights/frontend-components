/* eslint-disable camelcase */
import React from 'react';
import { mount } from 'enzyme';
import { Label } from '@patternfly/react-core';

import OperatingSystemFormatter from './OperatingSystemFormatter';

describe('OperatingSystemFormatter', () => {
    let systemProfile;

    it('should render correctly with RHEL and version', () => {
        systemProfile = {
            operating_system: {
                name: 'RHEL',
                major: 7,
                minor: 4
            }
        };

        const wrapper = mount(<OperatingSystemFormatter systemProfile={systemProfile}/>);

        expect(wrapper.find(Label).props().color).toEqual('red');
        expect(wrapper.find(Label).text()).toEqual('RHEL 7.4');
    });

    it('should render correctly with RHEL and no version', () => {
        systemProfile = {
            operating_system: {
                name: 'RHEL',
                major: 7,
                minor: null
            }
        };

        const wrapper = mount(<OperatingSystemFormatter systemProfile={systemProfile}/>);

        expect(wrapper.find(Label).props().color).toEqual('red');
        expect(wrapper.find(Label).text()).toEqual('RHEL ');
    });

    it('should render with different system', () => {
        systemProfile = {
            operating_system: {
                name: 'Windows'
            }
        };

        const wrapper = mount(<OperatingSystemFormatter systemProfile={systemProfile}/>);

        expect(wrapper.find(Label).props().color).toEqual(undefined);
        expect(wrapper.find(Label).text()).toEqual('Windows');
    });

    it('missing name', () => {
        systemProfile = {
            operating_system: {
                name: null
            }
        };

        const wrapper = mount(<OperatingSystemFormatter systemProfile={systemProfile}/>);

        expect(wrapper.find(Label)).toHaveLength(0);
        expect(wrapper.text()).toEqual('Not available');
    });

    it('missing operating system', () => {
        systemProfile = {};

        const wrapper = mount(<OperatingSystemFormatter systemProfile={systemProfile}/>);

        expect(wrapper.find(Label)).toHaveLength(0);
        expect(wrapper.text()).toEqual('Not available');
    });
});
