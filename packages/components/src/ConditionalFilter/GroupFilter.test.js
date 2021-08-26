import React from 'react';
import Group from './GroupFilter';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { act } from 'react-dom/test-utils';

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
        },
        {
            label: 'Groupselectable value',
            groupSelectable: true,
            items: [
                {
                    label: 'First value',
                    value: 'first'
                },
                {
                    label: 'Second value'
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

        describe('show more', () => {
            it('should render correctly with items and default text', () => {
                const wrapper = shallow(<Group {...config} onShowMore={() => undefined} />);
                expect(toJson(wrapper)).toMatchSnapshot();
            });

            it('should render correctly with items and custom text', () => {
                const wrapper = shallow(<Group {...config} onShowMore={() => undefined} showMoreTitle="some title" />);
                expect(toJson(wrapper)).toMatchSnapshot();
            });

            it('should render correctly with items and different variant', () => {
                const wrapper = shallow(<Group {...config} onShowMore={() => undefined} showMoreOptions={{
                    variant: 'default'
                }} />);
                expect(toJson(wrapper)).toMatchSnapshot();
            });

            it('should render correctly with items and custom props', () => {
                const wrapper = shallow(<Group {...config} onShowMore={() => undefined} showMoreOptions={{
                    props: {
                        className: 'some-test-class'
                    }
                }} />);
                expect(toJson(wrapper)).toMatchSnapshot();
            });
        });

        it('should render correctly with items - isDisabled', () => {
            const wrapper = shallow(<Group {...config} isDisabled />);
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
            wrapper.find('button.pf-c-menu-toggle').simulate('click');
            wrapper.update();
            expect(wrapper.find('.pf-c-menu').length > 0).toBe(true);
        });
    });
});
