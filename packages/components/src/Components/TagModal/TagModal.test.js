import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import TagModal from './TagModal';

describe('TagCount component', () => {
    it('Render the modal open with row of tags', () => {
        const wrapper = shallow(<TagModal isOpen={true} systemName={'paul.localhost.com'} rows={[ [ 'key', 'value' ], [ 'thing', 'otherthing' ] ]} />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('Render the modal with a child component', () => {
        const wrapper = shallow(<TagModal isOpen={true} systemName={'paul.localhost.com'}>
            <h1>I am a chile component</h1>
        </TagModal>);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
