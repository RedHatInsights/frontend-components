import React from 'react';
import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme';
import ComplianceEmptyState from './ComplianceEmptyState';
import { useQuery } from '@apollo/react-hooks';
jest.mock('@apollo/react-hooks');
jest.mock('apollo-boost');

describe('ComplianceEmptyState', () => {
    it('expect to render without error if no policies exist', () => {
        useQuery.mockImplementation(() => ({
            data: { profiles: { totalCount: 0 } }, error: false, loading: false
        }));
        const wrapper = shallow(
            <ComplianceEmptyState />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('expect to render different message if one policy exists', () => {
        useQuery.mockImplementation(() => ({
            data: { profiles: { totalCount: 1 } }, error: false, loading: false
        }));
        const wrapper = shallow(
            <ComplianceEmptyState />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('expect to render different message if many policies exist', () => {
        useQuery.mockImplementation(() => ({
            data: { profiles: { totalCount: 2 } }, error: false, loading: false
        }));
        const wrapper = shallow(
            <ComplianceEmptyState />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
