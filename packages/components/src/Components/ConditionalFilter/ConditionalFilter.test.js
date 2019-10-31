import React from 'react';
import ConditionalFilter from './ConditionalFilter';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';

const config = [{
    id: 'some',
    label: 'Simple text 1',
    value: 'simple-text-1'
}, {
    label: 'Simple text 2',
    value: 'simple-text-2',
    type: 'text',
    filterValues: {
        value: 'some-value blaa'
    }
}, {
    label: 'Checkbox',
    value: 'checkbox-filter',
    type: 'checkbox',
    filterValues: {
        items: [{
            label: <div>Custom value</div>,
            value: 'some-value'
        }, {
            label: 'Another',
            value: 'another-value'
        }, {
            label: 'No value'
        }]
    }
}, {
    label: 'Radio filter',
    value: 'radio-filter',
    type: 'radio',
    filterValues: {
        items: [{
            label: <div>Custom value</div>,
            value: 'some-value'
        }, {
            label: 'Another',
            value: 'another-value'
        }]
    }
}, {
    label: 'No value',
    type: 'text'
}];

describe('ConditionalFilter', () => {
    describe('render', () => {
        it('should render correctly', () => {
            const wrappper = shallow(<ConditionalFilter />);
            expect(toJson(wrappper)).toMatchSnapshot();
        });

        it('should render correctly with config', () => {
            const wrappper = shallow(<ConditionalFilter items={ config } />);
            expect(toJson(wrappper)).toMatchSnapshot();
        });

        config.map(({ value, label }) => {
            it(`should render correctly ${label} with value ${value}`, () => {
                const onChange = jest.fn();
                const wrappper = shallow(<ConditionalFilter items={ config } value={ value } onChange={ onChange }/>);
                expect(toJson(wrappper)).toMatchSnapshot();
            });
        });

        it('should render correctly with one filter', () => {
            const wrappper = shallow(<ConditionalFilter items={[ config[0] ]} />);
            expect(toJson(wrappper)).toMatchSnapshot();
        });
    });

    describe('API', () => {
        it('should not call onChange', () => {
            const onChange = jest.fn();
            const wrappper = mount(<ConditionalFilter />);
            wrappper.find('input').first().simulate('change', { target: { value: 'new-value' } });
            expect(onChange).not.toHaveBeenCalled();
        });

        it('should call onChange', () => {
            const onChange = jest.fn();
            const wrappper = mount(<ConditionalFilter onChange={ onChange } />);
            wrappper.find('input').first().simulate('change', { target: { value: 'new-value' } });
            expect(onChange).toHaveBeenCalled();
        });

        it('should open dropdown', () => {
            const wrappper = mount(<ConditionalFilter items={ config } />);
            wrappper.find('button.pf-c-dropdown__toggle').first().simulate('click');
            wrappper.update();
            expect(wrappper.instance().state.isOpen).toBe(true);
        });

        it('should call NOT call onChange when clicked on dropdown', () => {
            const onChange = jest.fn();
            const wrappper = mount(<ConditionalFilter items={ config } />);
            wrappper.find('button.pf-c-dropdown__toggle').first().simulate('click');
            wrappper.update();
            wrappper.find('ul.pf-c-dropdown__menu button.pf-c-dropdown__menu-item').first().simulate('click');
            expect(onChange).not.toHaveBeenCalled();
        });

        it('should call call onChange when clicked on dropdown', () => {
            const onChange = jest.fn();
            const wrappper = mount(<ConditionalFilter items={ config } onChange={ onChange }/>);
            wrappper.find('button.pf-c-dropdown__toggle').first().simulate('click');
            wrappper.update();
            wrappper.find('ul.pf-c-dropdown__menu button.pf-c-dropdown__menu-item').first().simulate('click');
            expect(onChange).toHaveBeenCalled();
        });

        it('should update state on select', () => {
            const wrappper = mount(<ConditionalFilter items={ config } />);
            wrappper.find('button.pf-c-dropdown__toggle').first().simulate('click');
            wrappper.update();
            wrappper.find('ul.pf-c-dropdown__menu button.pf-c-dropdown__menu-item').at(2).simulate('click');
            expect(wrappper.instance().state.stateValue).toBe('checkbox-filter');
        });
    });
});
