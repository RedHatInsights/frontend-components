import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Description from '../../../sourceFormRenderer/components/Description';

describe('Description component', () => {
    describe('should render correctly', () => {
        let content;
        let className;
        let name;

        beforeEach(() => {
            content = <h1>Cosi</h1>;
            className = 'classa';
            name = 'description';
        });

        it('content', () => {
            const wrapper = shallow(<Description content={ content } name={ name }/>);
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('content with className', () => {
            const wrapper = shallow(<Description content={ content } className={ className } name={ name }/>);
            expect(toJson(wrapper)).toMatchSnapshot();
        });
    });
});
