import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import SSLFormLabel from '../../addSourceWizard/SSLFormLabel';

describe('SSLFormLabel', () => {
    it('renders loading step correctly', () => {
        const wrapper = shallow(<SSLFormLabel />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
