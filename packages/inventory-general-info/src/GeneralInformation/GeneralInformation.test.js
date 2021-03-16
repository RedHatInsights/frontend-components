/* eslint-disable react/display-name */
/* eslint-disable camelcase */
import React from 'react';
import { render, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import GeneralInformation from './GeneralInformation';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { osTest, biosTest, collectInfoTest, configTest, infraTest, testProperties } from '../__mock__/selectors';
import promiseMiddleware from 'redux-promise-middleware';
import { mock } from '../__mock__/hostApi';
import mockedData from '../__mock__/mockedData.json';

jest.mock('@redhat-cloud-services/frontend-components-utilities/RBACHook', () => ({
    esModule: true,
    usePermissions: () => ({ hasAccess: true })
}));

describe('GeneralInformation', () => {
    let initialState;
    let mockStore;

    beforeEach(() => {
        mockStore = configureStore([ promiseMiddleware() ]);
        initialState = {
            entityDetails: {
                entity: {
                    id: 'test-id'
                }
            },
            systemProfileStore: {
                systemProfile: {
                    loaded: true,
                    ...infraTest,
                    ...osTest,
                    ...biosTest,
                    ...collectInfoTest,
                    ...configTest,
                    ...testProperties,
                    network: {
                        ipv4: [ '1', '2' ],
                        ipv6: [ '6', '3' ],
                        interfaces: [{
                            mac_address: '0:0:0',
                            mtu: 150,
                            name: 'some name',
                            state: 'UP',
                            type: 'some type'
                        }, {
                            mac_address: '1:0:0',
                            mtu: 1150,
                            name: 'asome name',
                            state: 'UP',
                            type: 'asome type'
                        }]
                    }
                }
            }
        };
    });

    it('should render correctly - no data', () => {
        const store = mockStore({ systemProfileStore: {}, entityDetails: {} });
        const wrapper = render(<Provider store={ store }>
            <GeneralInformation />
        </Provider>);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render correctly', () => {
        const store = mockStore(initialState);
        const wrapper = render(<Provider store={ store }>
            <GeneralInformation />
        </Provider>);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    describe('custom components', () => {
        [
            'SystemCardWrapper',
            'OperatingSystemCardWrapper',
            'BiosCardWrapper',
            'InfrastructureCardWrapper',
            'ConfigurationCardWrapper',
            'CollectionCardWrapper'
        ].map((item) => {
            it(`should not render ${item}`, () => {
                const store = mockStore(initialState);
                const wrapper = render(<Provider store={ store }>
                    <GeneralInformation {...{ [item]: false }} />
                </Provider>);
                expect(toJson(wrapper)).toMatchSnapshot();
            });

            it(`should render custom ${item}`, () => {
                const store = mockStore(initialState);
                const wrapper = render(<Provider store={ store }>
                    <GeneralInformation {...{ [item]: () => <div>test</div> }} />
                </Provider>);
                expect(toJson(wrapper)).toMatchSnapshot();
            });
        });
    });

    describe('API', () => {
        mock.onGet('/api/inventory/v1/hosts/test-id/system_profile').reply(200, mockedData);
        it('should get data from server', () => {
            const store = mockStore({
                systemProfileStore: {},
                entityDetails: {
                    entity: {
                        id: 'test-id'
                    }
                } });
            mount(<Provider store={ store }>
                <GeneralInformation />
            </Provider>);
            expect(store.getActions()[0].type).toBe('LOAD_SYSTEM_PROFILE_PENDING');
        });

        it('should open modal', () => {
            const store = mockStore(initialState);
            const wrapper = mount(<Provider store={ store }>
                <GeneralInformation />
            </Provider>);
            wrapper.find('a[href$="interfaces"]').first().simulate('click');
            wrapper.update();
            expect(wrapper.find('GeneralInformation').instance().state.isModalOpen).toBe(true);
            expect(wrapper.find('GeneralInformation').instance().state.modalTitle).toBe('Interfaces/NICs');
        });

        it('should update on sort', () => {
            const store = mockStore(initialState);
            const wrapper = mount(<Provider store={ store }>
                <GeneralInformation />
            </Provider>);
            wrapper.find('a[href$="interfaces"]').first().simulate('click');
            wrapper.update();
            const [ firstRow, secondRow ] = wrapper.find('GeneralInformation').instance().state.rows;
            wrapper.find('table th button').first().simulate('click');
            wrapper.update();
            expect(wrapper.find('GeneralInformation').instance().state.rows[0]).toEqual(secondRow);
            expect(wrapper.find('GeneralInformation').instance().state.rows[1]).toEqual(firstRow);
        });

        it('should open modal', () => {
            const store = mockStore(initialState);
            const wrapper = mount(<Provider store={ store }>
                <GeneralInformation />
            </Provider>);
            wrapper.find('a[href$="interfaces"]').first().simulate('click');
            wrapper.update();
            wrapper.find('.ins-c-inventory__detail--dialog button.pf-m-plain').first().simulate('click');
            wrapper.update();
            expect(wrapper.find('GeneralInformation').instance().state.isModalOpen).toBe(false);
        });

        it('should calculate first index when expandable', () => {
            const store = mockStore(initialState);
            const wrapper = mount(<Provider store={ store }>
                <GeneralInformation />
            </Provider>);
            wrapper.find('GeneralInformation').instance().handleModalToggle('title', {
                cells: [{ title: 'one' }, { title: 'two' }],
                rows: [
                    { cells: [ 'a', 'aa' ] },
                    { cells: [ 'b', 'bb' ] }],
                expandable: true
            });
        });
    });
});
