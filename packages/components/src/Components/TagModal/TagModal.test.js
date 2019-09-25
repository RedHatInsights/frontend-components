import React from 'react';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import TagModal from './TagModal';

describe('TagCount component', () => {
    it('Render the modal open with 11 tags', () => {
        const wrapper = shallow(<TagModal modalOpen={true} systemName={'paul.localhost.com'} />)
        expect(toJson(wrapper)).toMatchSnapshot();
    });
})
