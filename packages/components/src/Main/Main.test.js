import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Main } from './Main';
let state = {};

global.insights = {
    chrome: {
        $internal: {
            store: {
                getState: () => state
            }
        }
    }
};

describe('Main component', () => {
    describe('should render correctly', () => {
        it('without app', () => {
            const wrapper = mount(<Main>Something</Main>);
            expect(toJson(wrapper)).toMatchSnapshot();
        });
    });
    describe('page descriptors', () => {
        state = {
            chrome: {
                appId: 'some-app'
            }
        };
        it('with app', () => {
            const wrapper = mount(<Main path='/'>Something</Main>);
            expect(wrapper.find('[page-type="some-app"]').length).toBe(1);
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('with path', () => {
            const wrapper = mount(<Main path='/another/url/parts'>Something</Main>);
            expect(wrapper.find('[page-type="some-app-another-url-parts"]').length).toBe(1);
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('with dynamic path and params', () => {
            const wrapper = mount(<Main path='/another/:ID' params={{ ID: '1' }}>Something</Main>);
            expect(wrapper.find('[page-type="some-app-another"]').length).toBe(1);
            expect(wrapper.find('[data-id="1"]').length).toBe(1);
            expect(toJson(wrapper)).toMatchSnapshot();
        });
    });
});
