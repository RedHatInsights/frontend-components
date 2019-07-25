import React from 'react';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import ClearIndicator from './ClearIndicator';

describe('ClearIndicator component', () => {
    describe('should render', () => {
        it('required props', () => {
            const wrapper = shallow(<ClearIndicator innerProps={{ className: 'some-class' }} />);
            expect(toJson(wrapper)).toMatchSnapshot();
        });
    });

    describe('api', () => {
        const onClear = jest.fn();
        it('should NOT call onClear', () => {
            const wrapper = mount(<ClearIndicator innerProps={{ }} />);
            wrapper.find('svg').first().simulate('click');
            expect(onClear.mock.calls.length).toBe(0);
        });

        it('should BE call onClear', () => {
            const wrapper = mount(<ClearIndicator innerProps={{}} clearValue={onClear}/>);
            wrapper.find('svg').first().simulate('click');
            expect(onClear.mock.calls.length).toBe(1);
        });
    });
});
