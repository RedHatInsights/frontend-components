import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import Option from './Option';

const requiredProps = {
    getStyles: () => undefined,
    cx: () => undefined
};

describe('Option component', () => {
    describe('should render', () => {
        it('required props', () => {
            const wrapper = mount(<Option {...requiredProps} />);
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        [true, false].map((item) => {
            it(`isSelected - ${item}`, () => {
                const wrapper = mount(<Option isSelected={item} {...requiredProps} />);
                expect(toJson(wrapper)).toMatchSnapshot();
            });

            it(`isFocused - ${item}`, () => {
                const wrapper = mount(<Option isFocused={item} {...requiredProps} />);
                expect(toJson(wrapper)).toMatchSnapshot();
            });

            it(`isCheckbox - ${item}`, () => {
                const wrapper = mount(<Option selectProps={{ isCheckbox: item }} {...requiredProps} />);
                expect(toJson(wrapper)).toMatchSnapshot();
            });
        });

        describe('isSelected', () => {
            [true, false].map((item) => {
                it(`isCheckbox - ${item}`, () => {
                    const wrapper = mount(<Option
                        isSelected={true}
                        selectProps={{ isCheckbox: item }}
                        {...requiredProps}
                    />);
                    expect(toJson(wrapper)).toMatchSnapshot();
                });

                it(`isCheckbox - ${item}`, () => {
                    const wrapper = mount(<Option
                        data={{
                            selected: true
                        }}
                        selectProps={{ isCheckbox: item }}
                        {...requiredProps}
                    />);
                    expect(toJson(wrapper)).toMatchSnapshot();
                });
            });
        });

        describe('api', () => {
            const selectOption = jest.fn();

            it('should not call selectOption', () => {
                const wrapper = mount(<Option selectProps={{ isCheckbox: true }} {...requiredProps} />);
                wrapper.find('input[type="checkbox"]').first().simulate('change');
                expect(selectOption.mock.calls.length).toBe(0);
            });

            it('should not call selectOption', () => {
                const wrapper = mount(<Option
                    selectProps={{ isCheckbox: true }}
                    selectOption={selectOption}
                    {...requiredProps}
                />);
                wrapper.find('input[type="checkbox"]').first().simulate('change');
                expect(selectOption.mock.calls.length).toBe(1);
            });
        });
    });
});
