import React from 'react';
import toJson from 'enzyme-to-json';

import SSLFormLabel from '../../addSourceWizard/SSLFormLabel';
import mount from '../__mocks__/mount';

describe('SSLFormLabel', () => {
    it('renders loading step correctly', () => {
        const wrapper = mount(<SSLFormLabel />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
