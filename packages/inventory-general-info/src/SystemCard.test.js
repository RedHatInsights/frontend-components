/* eslint-disable camelcase */
import React from 'react';
jest.mock('@redhat-cloud-services/frontend-components-inventory/actions', () => ({
    loadEntity: jest.fn().mockImplementation(() => ({
        type: 'test-load-entity',
        payload: new Promise(res => res())
    }))
}));
import { render, mount, shallow } from 'enzyme';
import toJson, { shallowToJson } from 'enzyme-to-json';
import SystemCard from './SystemCard';
import configureStore from 'redux-mock-store';
import { testProperties } from './__mock__/selectors';
import promiseMiddleware from 'redux-promise-middleware';
import { mock } from './__mock__/hostApi';
import mockedData from './__mock__/mockedData.json';

describe('SystemCard', () => {
    let initialState;
    let mockStore;

    beforeEach(() => {
        mockStore = configureStore([ promiseMiddleware() ]);
        initialState = {
            entityDetails: {
                entity: {
                    display_name: 'test-display-name',
                    ansible_host: 'test-ansible-host',
                    id: 'test-id'
                }
            },
            systemProfileStore: {
                systemProfile: {
                    loaded: true,
                    ...testProperties
                }
            }
        };
    });

    it('should render correctly - no data', () => {
        const store = mockStore({ systemProfileStore: {}, entityDetails: {}});
        const wrapper = render(<SystemCard store={ store } />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render correctly with data', () => {
        const store = mockStore(initialState);
        const wrapper = render(<SystemCard store={ store } />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    describe('API', () => {
        it('should calculate correct ansible host - direct ansible host', () => {
            const store = mockStore(initialState);
            const wrapper = mount(<SystemCard store={ store } />);
            expect(wrapper.find('SystemCard').first().instance().getAnsibleHost()).toBe('test-ansible-host');
        });

        it('should calculate correct ansible host - fqdn', () => {
            const store = mockStore({
                ...initialState,
                entityDetails: {
                    entity: {
                        ...initialState.entity,
                        ansible_host: undefined,
                        fqdn: 'test-fqdn'
                    }
                }
            });
            const wrapper = mount(<SystemCard store={ store } />);
            expect(wrapper.find('SystemCard').first().instance().getAnsibleHost()).toBe('test-fqdn');
        });

        it('should calculate correct ansible host - fqdn', () => {
            const store = mockStore({
                ...initialState,
                entityDetails: {
                    entity: {
                        ...initialState.entity,
                        ansible_host: undefined,
                        id: 'test-id'
                    }
                }
            });
            const wrapper = mount(<SystemCard store={ store } />);
            expect(wrapper.find('SystemCard').first().instance().getAnsibleHost()).toBe('test-id');
        });

        it('should show edit display name', () => {
            const store = mockStore(initialState);
            const wrapper = mount(<SystemCard store={ store } />);
            wrapper.find('a[href$="display_name"]').first().simulate('click', {
                preventDefault: () => undefined
            });
            expect(wrapper.find('TextInputModal[title="Edit name"]').first().instance().props.isOpen).toBe(true);
            expect(wrapper.find('TextInputModal[title="Edit Ansible host"]').first().instance().props.isOpen).toBe(false);
        });

        it('should show edit display name', () => {
            const store = mockStore(initialState);
            const wrapper = mount(<SystemCard store={ store } />);
            wrapper.find('a[href$="ansible_name"]').first().simulate('click', {
                preventDefault: () => undefined
            });
            expect(wrapper.find('TextInputModal[title="Edit name"]').first().instance().props.isOpen).toBe(false);
            expect(wrapper.find('TextInputModal[title="Edit Ansible host"]').first().instance().props.isOpen).toBe(true);
        });

        it('should NOT call handleClick', () => {
            const store = mockStore({
                ...initialState,
                systemProfileStore: {
                    systemProfile: {
                        ...initialState.systemProfileStore.systemProfile,
                        disk_devices: [{
                            device: 'test-device',
                            label: 'test-label',
                            mount_point: 'test-mount',
                            options: { one: 'value' },
                            type: 'test-value'
                        }]
                    }
                }
            });
            const onClick = jest.fn();
            const wrapper = mount(<SystemCard store={ store } />);
            wrapper.find('TextListItem a[href$="storage"]').first().simulate('click', {
                preventDefault: () => undefined
            });
            expect(onClick).not.toHaveBeenCalled();
        });

        it('should call handleClick', () => {
            const store = mockStore({
                ...initialState,
                systemProfileStore: {
                    systemProfile: {
                        ...initialState.systemProfileStore.systemProfile,
                        disk_devices: [{
                            device: 'test-device',
                            label: 'test-label',
                            mount_point: 'test-mount',
                            options: { one: 'value' },
                            type: 'test-value'
                        }]
                    }
                }
            });
            const onClick = jest.fn();
            const wrapper = mount(<SystemCard store={ store } handleClick={ onClick } />);
            wrapper.find('TextListItem a[href$="storage"]').first().simulate('click', {
                preventDefault: () => undefined
            });
            expect(onClick).toHaveBeenCalled();
        });

        it('should call edit display name actions', () => {
            mock.onPatch('/api/inventory/v1/hosts/test-id').reply(200, mockedData);
            mock.onGet('/api/inventory/v1/hosts/test-id/system_profile').reply(200, mockedData);
            const store = mockStore(initialState);
            const wrapper = mount(<SystemCard store={ store } />);
            wrapper.find('a[href$="display_name"]').first().simulate('click', {
                preventDefault: () => undefined
            });
            wrapper.find('button[data-action="confirm"]').first().simulate('click');
            expect(store.getActions()[0].type).toBe('SET_DISPLAY_NAME_PENDING');
        });

        it('should call edit display name actions', () => {
            mock.onPatch('/api/inventory/v1/hosts/test-id').reply(200, mockedData);
            mock.onGet('/api/inventory/v1/hosts/test-id/system_profile').reply(200, mockedData);
            const store = mockStore(initialState);
            const wrapper = mount(<SystemCard store={ store } />);
            wrapper.find('a[href$="ansible_name"]').first().simulate('click', {
                preventDefault: () => undefined
            });
            wrapper.find('button[data-action="confirm"]').first().simulate('click');
            expect(store.getActions()[0].type).toBe('SET_ANSIBLE_HOST_PENDING');
        });
    });
});
