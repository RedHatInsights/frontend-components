import React from 'react';
import ConditionalFilter from './ConditionalFilter';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';

const config = [{
    id: 'some',
    label: 'simple text 1',
    value: 'simple-text-1'
}, {
    label: 'simple text 2',
    value: 'simple-text-2',
    type: 'text',
    filterValues: {
        value: 'some-value blaa'
    }
}, {
    label: 'checkbox',
    value: 'checkbox-filter',
    type: 'checkbox',
    filterValues: {
        items: [{
            label: <div>custom value</div>,
            value: 'some-value'
        }, {
            label: 'another',
            value: 'another-value'
        }, {
            label: 'no value'
        }]
    }
}, {
    label: 'radio filter',
    value: 'radio-filter',
    type: 'radio',
    filterValues: {
        items: [{
            label: <div>custom value</div>,
            value: 'some-value'
        }, {
            label: 'another',
            value: 'another-value'
        }]
    }
}, {
    label: 'no value',
    type: 'text'
}];

const initialProps = {
    useMobileLayout: true
};

describe('ConditionalFilter', () => {
    describe('render', () => {
        it('should render correctly', () => {
            const wrappper = shallow(<ConditionalFilter {...initialProps} />);
            expect(toJson(wrappper)).toMatchSnapshot();
        });

        it('should render correctly - isDisabled', () => {
            const wrappper = shallow(<ConditionalFilter {...initialProps} items={ config } isDisabled />);
            expect(toJson(wrappper)).toMatchSnapshot();
        });

        it('should render correctly with config', () => {
            const wrappper = shallow(<ConditionalFilter {...initialProps} items={ config } />);
            expect(toJson(wrappper)).toMatchSnapshot();
        });

        it('should render correctly with config - each item as disabled', () => {
            const wrappper = shallow(<ConditionalFilter {...initialProps} items={ config.map(item =>(
                { ...item, filterValues: { ...item.filterValues, isDisabled: true } })
            ) } />);
            expect(toJson(wrappper)).toMatchSnapshot();
        });

        config.map(({ value, label }) => {
            it(`should render correctly ${label} with value ${value}`, () => {
                const onChange = jest.fn();
                const wrappper = shallow(<ConditionalFilter {...initialProps} items={ config } value={ value } onChange={ onChange }/>);
                expect(toJson(wrappper)).toMatchSnapshot();
            });
        });

        it('should render correctly with one filter', () => {
            const wrappper = shallow(<ConditionalFilter {...initialProps} items={[ config[0] ]} />);
            expect(toJson(wrappper)).toMatchSnapshot();
        });

        it('should render correctly with with the active label hidden', () => {
            const wrappper = shallow(<ConditionalFilter {...initialProps} hideLabel={ true } items={ config } />);
            expect(toJson(wrappper)).toMatchSnapshot();
        });
    });

    describe('API', () => {
        it('should not call onChange', () => {
            const onChange = jest.fn();
            const wrappper = mount(<ConditionalFilter {...initialProps} />);
            wrappper.find('input').first().simulate('change', { target: { value: 'new-value' } });
            expect(onChange).not.toHaveBeenCalled();
        });

        it('should call onChange', () => {
            const onChange = jest.fn();
            const wrappper = mount(<ConditionalFilter {...initialProps} onChange={ onChange } />);
            wrappper.find('input').first().simulate('change', { target: { value: 'new-value' } });
            expect(onChange).toHaveBeenCalled();
        });

        it('should open dropdown', () => {
            const wrappper = mount(<ConditionalFilter {...initialProps} items={ config } />);
            wrappper.find('button.pf-c-dropdown__toggle').first().simulate('click');
            wrappper.update();
            expect(wrappper.instance().state.isOpen).toBe(true);
        });

        it('should call NOT call onChange when clicked on dropdown', () => {
            const onChange = jest.fn();
            const wrappper = mount(<ConditionalFilter {...initialProps} items={ config } />);
            wrappper.find('button.pf-c-dropdown__toggle').first().simulate('click');
            wrappper.update();
            wrappper.find('ul.pf-c-dropdown__menu button.pf-c-dropdown__menu-item').first().simulate('click');
            expect(onChange).not.toHaveBeenCalled();
        });

        it('should call call onChange when clicked on dropdown', () => {
            const onChange = jest.fn();
            const wrappper = mount(<ConditionalFilter {...initialProps} items={ config } onChange={ onChange }/>);
            wrappper.find('button.pf-c-dropdown__toggle').first().simulate('click');
            wrappper.update();
            wrappper.find('ul.pf-c-dropdown__menu button.pf-c-dropdown__menu-item').first().simulate('click');
            expect(onChange).toHaveBeenCalled();
        });

        it('should update state on select', () => {
            const wrappper = mount(<ConditionalFilter {...initialProps} items={ config } />);
            wrappper.find('button.pf-c-dropdown__toggle').first().simulate('click');
            wrappper.update();
            wrappper.find('ul.pf-c-dropdown__menu button.pf-c-dropdown__menu-item').at(2).simulate('click');
            expect(wrappper.instance().state.stateValue).toBe('checkbox-filter');
        });
    });
});
