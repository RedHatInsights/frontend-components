/* eslint-disable camelcase */
import React from 'react';
import { render } from 'enzyme';
import toJson from 'enzyme-to-json';
import CollectionCard from './CollectionCard';
import configureStore from 'redux-mock-store';
import { collectInfoTest } from './__mock__/selectors';

describe('CollectionCard', () => {
    let initialState;
    let mockStore;

    beforeEach(() => {
        mockStore = configureStore();
        initialState = {
            entityDetails: {
                entity: {
                    updated: '6/01/2014',
                    created: '04/01/2014'
                }
            },
            systemProfileStore: {
                systemProfile: {
                    loaded: true,
                    ...collectInfoTest
                }
            }
        };
    });

    it('should render correctly - no data', () => {
        const store = mockStore({ systemProfileStore: {}, entityDetails: {} });
        const wrapper = render(<CollectionCard store={ store } />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render correctly with data', () => {
        const store = mockStore(initialState);
        const wrapper = render(<CollectionCard store={ store } />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
