import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import NotAuthorized from './NotAuthorized';

describe('NotAuthorized component', () => {
    it('should render', () => {
        const wrapper = shallow(<NotAuthorized serviceName='Foo' />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
