import React from 'react';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import NotAuthorized from './NotAuthorized';

describe('NotAuthorized component', () => {
    it('should render', () => {
        const wrapper = shallow(<NotAuthorized serviceName='Foo' />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should apply custom styles', () => {
        const wrapper = shallow(<NotAuthorized className="something" />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should use custom icon', () => {
        const wrapper = mount(<NotAuthorized icon={() => 'some Icon!'} />);
        expect(toJson(wrapper, { mode: 'deep' })).toMatchSnapshot();
    });

    it('should not show buttons', () => {
        const wrapper = shallow(<NotAuthorized showReturnButton={false} />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should show custom description', () => {
        const wrapper = shallow(<NotAuthorized description="Some text" />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
