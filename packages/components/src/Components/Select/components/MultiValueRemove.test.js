import React from 'react';
import { render } from 'enzyme';
import toJson from 'enzyme-to-json';
import MultiValueRemove from './MultiValueRemove';

describe('MultiValueRemove component', () => {
    describe('should render', () => {
        it('required props', () => {
            const wrapper = render(<MultiValueRemove innerProps={{ className: 'some-class' }} />);
            expect(toJson(wrapper)).toMatchSnapshot();
        });
    });
});
