import React from 'react';
import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme';
import ComplianceEmptyState from './ComplianceEmptyState';

describe('ComplianceEmptyState', () => {
    it('expect to render without error', () => {
        const wrapper = shallow(
            <ComplianceEmptyState />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
