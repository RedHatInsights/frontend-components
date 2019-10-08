import React from 'react';
import Group from './Group';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';

const config = {
    groups: [
        {
            label: 'First value',
            items: [
                {
                    label: 'First value',
                    value: 'first'
                },
                {
                    label: 'Second value'
                }
            ]
        },
        {
            label: 'Second value',
            value: 'second',
            type: 'checkbox',
            items: [
                {
                    label: 'First checkbox'
                },
                {
                    label: 'Second checkbox',
                    value: 'some-value'
                }
            ]
        },
        {
            label: 'Third value',
            value: 'third',
            type: 'radio',
            items: [
                {
                    label: 'First radio'
                },
                {
                    label: 'Second radio'
                }
            ]
        }
    ]
};

describe('Group - component', () => {
    describe('render', () => {
        it('should render correctly', () => {
            const wrapper = shallow(<Group />);
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('should render correctly with items', () => {
            const wrapper = shallow(<Group {...config} />);
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('should render correctly with items and default value', () => {
            const wrapper = shallow(<Group { ...config } value={ [{ value: 'some-value' }] } />);
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('should render correctly placeholder', () => {
            const wrapper = shallow(<Group { ...config } placeholder="some placeholder" />);
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('should render correctly with items and selected value', () => {
            const currectConfig = { ...config };
            currectConfig.groups[1].items[1].isChecked = true;
            const wrapper = shallow(<Group {...currectConfig} />);
            expect(toJson(wrapper)).toMatchSnapshot();
        });
    });

    describe('API', () => {
        it('should open', () => {
            const wrapper = mount(<Group { ...config } />);
            wrapper.find('button.pf-c-select__toggle').first().simulate('click');
            wrapper.update();
            expect(wrapper.instance().state.isExpanded).toBe(true);
        });

        it('should NOT call onChange', () => {
            const onChange = jest.fn();
            const wrapper = mount(<Group { ...config } />);
            wrapper.find('button.pf-c-select__toggle').first().simulate('click');
            wrapper.update();
            wrapper.find('.pf-c-select__menu-item').first().simulate('click');
            expect(onChange).not.toHaveBeenCalled();
        });

        it('should call onChange', () => {
            const onChange = jest.fn();
            const wrapper = mount(<Group {...config} onChange={ onChange } />);
            wrapper.find('button.pf-c-select__toggle').first().simulate('click');
            wrapper.update();
            wrapper.find('.pf-c-select__menu-item').first().simulate('click');
            expect(onChange).toHaveBeenCalled();
        });
        it('should update selected', () => {
            const onChange = jest.fn();
            const wrapper = mount(<Group {...config} onChange={onChange} />);
            wrapper.find('button.pf-c-select__toggle').first().simulate('click');
            wrapper.update();
            wrapper.find('.pf-c-select__menu-item').first().simulate('click');
            wrapper.update();
            expect(wrapper.instance().state.selected).toEqual({ 0: { first: true } });
        });

        it(`should call item onClick`, () => {
            const onClick = jest.fn();
            const wrapper = mount(
                <Group
                    {...config}
                    groups={[
                        {
                            ...config.groups[1],
                            items: [
                                {
                                    ...config.groups[1].items[0],
                                    onClick
                                }
                            ]
                        }
                    ]}
                />
            );
            wrapper.find('button.pf-c-select__toggle').first().simulate('click');
            wrapper.update();
            wrapper.find(`.pf-c-select__menu-item`).first().simulate('click');
            expect(onClick).toHaveBeenCalled();
        });

        it(`should call group onSelect`, () => {
            const onSelect = jest.fn();
            const wrapper = mount(
                <Group
                    {...config}
                    groups={[
                        {
                            ...config.groups[1],
                            onSelect
                        }
                    ]}
                />
            );
            wrapper.find('button.pf-c-select__toggle').first().simulate('click');
            wrapper.update();
            wrapper.find(`.pf-c-select__menu-item`).first().simulate('click');
            expect(onSelect).toHaveBeenCalled();
        });

        [ 'check', 'radio' ].map((type, key) => {
            it(`should call item onChange - ${type}`, () => {
                const onChange = jest.fn();
                const wrapper = mount(
                    <Group
                        {...config}
                        groups={[
                            {
                                ...config.groups[key + 1],
                                items: [
                                    {
                                        ...config.groups[key + 1].items[0],
                                        onChange
                                    }
                                ]
                            }
                        ]}
                    />
                );
                wrapper.find('button.pf-c-select__toggle').first().simulate('click');
                wrapper.update();
                wrapper.find(`input.pf-c-${type}__input`).first().simulate('change');
                expect(onChange).toHaveBeenCalled();
            });
        });
        it('should update selected', () => {
            const onChange = jest.fn();
            const wrapper = mount(
                <Group
                    {...config}
                    groups={[
                        config.groups[1]
                    ]}
                    onChange={ onChange }
                    selected={ {
                        second: {
                            1: true
                        }
                    } }
                />
            );
            wrapper.find('button.pf-c-select__toggle').first().simulate('click');
            wrapper.update();
            wrapper.find('.pf-c-select__menu-item').first().simulate('click');
            expect(onChange.mock.calls[0][1]).toEqual({ second: { 0: true, 1: true } });
        });

        it('should deselect', () => {
            const onChange = jest.fn();
            const wrapper = mount(
                <Group
                    {...config}
                    groups={[
                        config.groups[1]
                    ]}
                    onChange={onChange}
                    selected={{
                        second: {
                            0: true
                        }
                    }}
                />
            );
            wrapper.find('button.pf-c-select__toggle').first().simulate('click');
            wrapper.update();
            wrapper.find('.pf-c-select__menu-item').first().simulate('click');
            expect(onChange.mock.calls[0][1]).toEqual({ second: { 0: false } });
        });

        it('should deselect radio', () => {
            const onChange = jest.fn();
            const wrapper = mount(
                <Group
                    {...config}
                    groups={[
                        config.groups[2]
                    ]}
                    onChange={onChange}
                    selected={{
                        third: {
                            1: true
                        }
                    }}
                />
            );
            wrapper.find('button.pf-c-select__toggle').first().simulate('click');
            wrapper.update();
            wrapper.find('.pf-c-select__menu-item').first().simulate('click');
            expect(onChange.mock.calls[0][1]).toEqual({ third: { 0: true } });
        });
    });
});
