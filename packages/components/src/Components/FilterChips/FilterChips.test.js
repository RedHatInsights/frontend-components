import React from 'react';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import FilterChips from './FilterChips';

const filters = [
    {
        category: 'Group 1',
        chips: [
            {
                name: 'Chip 1',
                isRead: true
            },
            {
                name: 'Chip 2',
                count: 3
            }
        ]
    },
    {
        name: 'Chip 3'
    },
    {
        name: 'Chip 4'
    }
];

describe('FilterChips component', () => {
    it('should render - no data', () => {
        const wrapper = shallow(<FilterChips/>);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render', () => {
        const wrapper = shallow(
            <FilterChips filters={ filters } />
        );
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    describe('API', () => {
        it('should have default onDelete handle', () => {
            const onDelete = FilterChips.defaultProps.onDelete;
            expect(onDelete).toBeDefined();
            expect(onDelete()).toEqual(undefined);
        });

        it('should call onDelete when deleting a single chip', () => {
            const onDelete = jest.fn();
            const wrapper = mount(<FilterChips filters={ filters } onDelete={ onDelete } />);
            wrapper.find('.pf-c-chip button').last().simulate('click');
            expect(onDelete).toHaveBeenCalledWith(expect.anything(), [{ name: 'Chip 4' }]);
            expect(onDelete).toHaveBeenCalledTimes(1);
        });

        it('should call onDelete when deleting a single chip in group', () => {
            const onDelete = jest.fn();
            const wrapper = mount(<FilterChips filters={ filters } onDelete={ onDelete } />);
            wrapper.find('.pf-c-chip button').first().simulate('click');
            expect(onDelete).toHaveBeenCalledWith(expect.anything(), [{
                category: 'Group 1',
                chips: [
                    {
                        name: 'Chip 1',
                        isRead: true
                    }
                ]
            }]);
            expect(onDelete).toHaveBeenCalledTimes(1);
        });

        it('should call onDelete when deleting all chips', () => {
            const onDelete = jest.fn();
            const wrapper = mount(<FilterChips filters={ filters } onDelete={ onDelete } />);
            wrapper.find('button').last().simulate('click');
            expect(onDelete).toHaveBeenCalledWith(expect.anything(), filters, true);
            expect(onDelete).toHaveBeenCalledTimes(1);
        });
    });
});
