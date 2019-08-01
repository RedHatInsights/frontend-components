import React from 'react';
import { render, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import ValueContainer from './ValueContainer';

const requiredProps = {
    getStyles: () => undefined,
    cx: () => undefined
};

describe('ValueContainer component', () => {
    describe('should render', () => {
        it('required props', () => {
            const wrapper = render(<ValueContainer {...requiredProps}>
                <div>aaa</div>
            </ValueContainer>);
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        describe('isMulti', () => {
            it('required props', () => {
                const wrapper = render(<ValueContainer isMulti {...requiredProps}>
                    <div>aaa</div>
                </ValueContainer>);
                expect(toJson(wrapper)).toMatchSnapshot();
            });

            it('two children', () => {
                const wrapper = render(<ValueContainer isMulti {...requiredProps}>
                    <div>aaa</div>
                    <div>aaa</div>
                </ValueContainer>);
                expect(toJson(wrapper)).toMatchSnapshot();
            });

            it('show more button', () => {
                const wrapper = render(<ValueContainer isMulti {...requiredProps}>
                    {[ 'first', 'second'].map(item => item)}
                    <div>aaa</div>
                </ValueContainer>);
                expect(toJson(wrapper)).toMatchSnapshot();
            });
        });
    });

    describe('api', () => {
        it('should toggle', () => {
            const wrapper = mount(<ValueContainer isMulti {...requiredProps}>
                {['first', 'second'].map(item => item)}
                <div>aaa</div>
            </ValueContainer>);
            wrapper.find('button.ins-c-select__value--container-chipgroup').first().simulate('click');
            wrapper.update();
            expect(toJson(wrapper)).toMatchSnapshot();
        });
    });
});
