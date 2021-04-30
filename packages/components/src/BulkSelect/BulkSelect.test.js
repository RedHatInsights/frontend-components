import React from 'react';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import BulkSelect from './BulkSelect';
import { Dropdown } from '@patternfly/react-core';

describe('BulkSelect', () => {
    it('should render correctly - no data', () => {
        const wrapper = shallow(<BulkSelect />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render correctly', () => {
        const wrapper = shallow(<BulkSelect count={ 30 } items={ [
            {
                title: 'Select all',
                onClick: jest.fn()
            }
        ] } id="some-id" />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render correctly', () => {
        const wrapper = shallow(<BulkSelect items={ [
            {
                title: 'Select all',
                onClick: jest.fn()
            }
        ] } />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render correctly - null checked', () => {
        const wrapper = shallow(<BulkSelect items={[
            {
                title: 'Select all',
                onClick: jest.fn()
            }
        ]} checked={ null } />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render custom props', () => {
        const wrapper = shallow(<BulkSelect items={ [
            {
                title: 'Select none',
                onClick: jest.fn(),
                props: {
                    isDisabled: true
                }
            },
            {
                title: 'Select all',
                onClick: jest.fn()
            }
        ] } />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    describe('API', () => {
        it('should call on select with no items', () => {
            const onSelect = jest.fn();
            const wrapper = mount(<BulkSelect onSelect={ onSelect } />);
            wrapper.find('input[type="checkbox"]').first().simulate('change');
            expect(onSelect).toHaveBeenCalled();
        });

        it('should call on select', () => {
            const onSelect = jest.fn();
            const wrapper = mount(<BulkSelect items={ [
                {
                    title: 'Select all',
                    onClick: jest.fn()
                }
            ] } onSelect={ onSelect } />);
            wrapper.find('.pf-c-dropdown__toggle-check input[type="checkbox"]').first().simulate('change');
            expect(onSelect).toHaveBeenCalled();
        });

        it('should NOT call on select', () => {
            const onSelect = jest.fn();
            const wrapper = mount(<BulkSelect items={ [
                {
                    title: 'Select all',
                    onClick: jest.fn()
                }
            ] } />);
            wrapper.find('.pf-c-dropdown__toggle-check input[type="checkbox"]').first().simulate('change');
            expect(onSelect).not.toHaveBeenCalled();
        });

        it('should call first action', () => {
            const onSelect = jest.fn();
            const otherAction = jest.fn();
            const wrapper = mount(<BulkSelect items={ [
                {
                    title: 'Select all',
                    onClick: onSelect
                }, {
                    title: 'Some action',
                    onClick: otherAction
                }
            ] } />);
            wrapper.find('.pf-c-dropdown__toggle-button').first().simulate('click');
            wrapper.update();
            wrapper.find('.pf-c-dropdown__menu li .pf-c-dropdown__menu-item').first().simulate('click');
            expect(onSelect).toHaveBeenCalled();
            expect(otherAction).not.toHaveBeenCalled();
        });

        it('should disable dropdown', () => {
            const wrapper = shallow(<BulkSelect items={ [
                {
                    title: 'Select all',
                    onClick: jest.fn()
                }
            ] }
            isDisabled={ true } />);
            expect(wrapper.find(Dropdown).prop('toggle').props.isDisabled).toBe(true);
        });
    });
});
