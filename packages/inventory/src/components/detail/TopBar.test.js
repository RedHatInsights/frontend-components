import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import promiseMiddleware from 'redux-promise-middleware';

import { Dropdown, DropdownItem } from '@patternfly/react-core';

import TopBar from './TopBar';
import { Provider } from 'react-redux';

describe('<TopBar />', () => {
    let wrapper;
    let entityId;
    let entity;
    let mockStore;
    let store;

    beforeEach(() => {
        entityId = '31';
        entity = { id: entityId };
        mockStore = configureStore([ promiseMiddleware() ]);
        store = mockStore();
    });

    it('renders !hideInvLink in dropdown', async () => {
        await act(async () => {
            wrapper = mount(
                <Provider store={ store }>
                    <TopBar entity={entity} loaded={true} />
                </Provider>
            );
        });
        wrapper.update();

        expect(wrapper.find(Dropdown)).toHaveLength(1);

        await act(async () => {
            wrapper.find(Dropdown).find('button').simulate('click');
        });
        wrapper.update();

        expect(wrapper.find(DropdownItem).props()).toMatchObject({
            children: 'View system in Inventory',
            component: 'a',
            href: `./insights/inventory/${entityId}`,
            index: 0,
            onClick: expect.any(Function)
        });
    });

    it('no drodpown when hideInvLink', async () => {
        await act(async () => {
            wrapper = mount(
                <Provider store={ store }>
                    <TopBar entity={entity} hideInvLink loaded={true} />
                </Provider>
            );
        });
        wrapper.update();

        expect(wrapper.find(Dropdown)).toHaveLength(0);
    });

    it('combines actions and inv link', async () => {
        await act(async () => {
            wrapper = mount(
                <Provider store={ store }>
                    <TopBar entity={entity} loaded={true} actions={[{ title: 'title', onClick: jest.fn() }]} />
                </Provider>
            );
        });
        wrapper.update();

        expect(wrapper.find(Dropdown)).toHaveLength(1);

        await act(async () => {
            wrapper.find(Dropdown).find('button').simulate('click');
        });
        wrapper.update();

        expect(wrapper.find(DropdownItem)).toHaveLength(2);
        expect(wrapper.find(DropdownItem).first().props()).toMatchObject({
            children: 'View system in Inventory',
            component: 'a',
            href: `./insights/inventory/${entityId}`,
            index: 0,
            onClick: expect.any(Function)
        });
        expect(wrapper.find(DropdownItem).last().props()).toMatchObject({
            children: 'title',
            component: 'button',
            index: 1,
            onClick: expect.any(Function)
        });
    });

    it('only actions', async () => {
        await act(async () => {
            wrapper = mount(
                <Provider store={ store }>
                    <TopBar entity={entity} hideInvLink loaded={true} actions={[{ title: 'title', onClick: jest.fn() }]} />
                </Provider>
            );
        });
        wrapper.update();

        expect(wrapper.find(Dropdown)).toHaveLength(1);

        await act(async () => {
            wrapper.find(Dropdown).find('button').simulate('click');
        });
        wrapper.update();

        expect(wrapper.find(DropdownItem)).toHaveLength(1);
        expect(wrapper.find(DropdownItem).props()).toMatchObject({
            children: 'title',
            component: 'button',
            index: 0,
            onClick: expect.any(Function)
        });
    });
});
