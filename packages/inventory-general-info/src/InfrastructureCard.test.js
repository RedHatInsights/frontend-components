/* eslint-disable camelcase */
import React from 'react';
import { render, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import InfrastructureCard from './InfrastructureCard';
import configureStore from 'redux-mock-store';
import { infraTest } from './__mock__/selectors';

describe('InfrastructureCard', () => {
    let initialState;
    let mockStore;

    beforeEach(() => {
        mockStore = configureStore();
        initialState = {
            systemProfileStore: {
                systemProfile: {
                    loaded: true,
                    ...infraTest
                }
            }
        };
    });

    it('should render correctly - no data', () => {
        const store = mockStore({ systemProfileStore: {}, entityDetails: {} });
        const wrapper = render(<InfrastructureCard store={ store } />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render correctly with data', () => {
        const store = mockStore(initialState);
        const wrapper = render(<InfrastructureCard store={ store } />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render enabled/disabled', () => {
        const store = mockStore({
            systemProfileStore: {
                systemProfile: {
                    loaded: true,
                    ...infraTest
                }
            }
        });
        const wrapper = render(<InfrastructureCard store={ store } />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    describe('api', () => {
        it('should NOT call handleClick', () => {
            const store = mockStore(initialState);
            const onClick = jest.fn();
            const wrapper = mount(<InfrastructureCard store={ store } />);
            wrapper.find('TextListItem a').first().simulate('click');
            expect(onClick).not.toHaveBeenCalled();
        });

        it('should call handleClick on packages', () => {
            const store = mockStore(initialState);
            const onClick = jest.fn();
            const wrapper = mount(<InfrastructureCard handleClick={ onClick } store={ store } />);
            wrapper.find('dd a').first().simulate('click');
            expect(onClick).toHaveBeenCalled();
        });

        it('should call handleClick on services', () => {
            const store = mockStore(initialState);
            const onClick = jest.fn();
            const wrapper = mount(<InfrastructureCard handleClick={ onClick } store={ store } />);
            wrapper.find('dd a').at(1).simulate('click');
            expect(onClick).toHaveBeenCalled();
        });

        it('should call handleClick on services', () => {
            const store = mockStore(initialState);
            const onClick = jest.fn();
            const wrapper = mount(<InfrastructureCard handleClick={ onClick } store={ store } />);
            wrapper.find('dd a').at(2).simulate('click');
            expect(onClick).toHaveBeenCalled();
        });
    });
});
