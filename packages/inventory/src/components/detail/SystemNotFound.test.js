import React from 'react';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import SystemNotFound from './SystemNotFound';

describe('EntityTable', () => {
    describe('DOM', () => {
        it('should render correctly', () => {
            const wrapper = shallow(<SystemNotFound />);
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('should render correctly with inv ID', () => {
            const wrapper = shallow(<SystemNotFound inventoryId="something" />);
            expect(toJson(wrapper)).toMatchSnapshot();
        });
    });

    describe('API', () => {
        const replace = jest.fn();
        const back = jest.fn();
        beforeEach(() => {
            Object.defineProperty(window, 'location', {
                writable: true,
                value: {
                    pathname: {
                        replace
                    },
                    href: ''
                }
            });

            Object.defineProperty(window, 'history', {
                writable: true,
                value: {
                    back
                }
            });
        });

        it('should call location replace correctly', () => {
            const onBackToListClick = jest.fn();
            const wrapper = mount(<SystemNotFound inventoryId="something" />);
            wrapper.find('button').first().simulate('click');
            expect(onBackToListClick).not.toHaveBeenCalled();
            expect(replace).toHaveBeenCalled();
        });

        it('should call history correctly', () => {
            Object.defineProperty(document, 'referrer', {
                writable: true,
                value: true
            });
            const onBackToListClick = jest.fn();
            const wrapper = mount(<SystemNotFound inventoryId="something" />);
            wrapper.find('button').first().simulate('click');
            expect(onBackToListClick).not.toHaveBeenCalled();
            expect(back).toHaveBeenCalled();
        });

        it('should call onBackToListClick correctly', () => {
            const onBackToListClick = jest.fn();
            const wrapper = mount(<SystemNotFound inventoryId="something" onBackToListClick={onBackToListClick} />);
            wrapper.find('button').first().simulate('click');
            expect(onBackToListClick).toHaveBeenCalled();
        });
    });
});
