/* eslint-disable camelcase */
import React from 'react';
import { render, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import OperatingSystemCard from './OperatingSystemCard';
import configureStore from 'redux-mock-store';
import { osTest } from './__mock__/selectors';

describe('OperatingSystemCard', () => {
    let initialState;
    let mockStore;

    beforeEach(() => {
        mockStore = configureStore();
        initialState = {
            systemProfileStore: {
                systemProfile: {
                    loaded: true,
                    ...osTest
                }
            }
        };
    });

    it('should render correctly - no data', () => {
        const store = mockStore({ systemProfileStore: {}, entityDetails: {}});
        const wrapper = render(<OperatingSystemCard store={ store } />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render correctly with data', () => {
        const store = mockStore(initialState);
        const wrapper = render(<OperatingSystemCard store={ store } />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render enabled/disabled', () => {
        const store = mockStore({
            systemProfileStore: {
                systemProfile: {
                    loaded: true,
                    ...osTest
                }
            }
        });
        const wrapper = render(<OperatingSystemCard store={ store } />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    describe('api', () => {
        it('should NOT call handleClick', () => {
            const store = mockStore(initialState);
            const onClick = jest.fn();
            const wrapper = mount(<OperatingSystemCard store={ store } />);
            wrapper.find('TextListItem a').first().simulate('click');
            expect(onClick).not.toHaveBeenCalled();
        });

        it('should call handleClick on packages', () => {
            const store = mockStore(initialState);
            const onClick = jest.fn();
            const wrapper = mount(<OperatingSystemCard handleClick={ onClick } store={ store } />);
            wrapper.find('dd a').first().simulate('click');
            expect(onClick).toHaveBeenCalled();
        });
    });
});
