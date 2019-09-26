/* eslint-disable camelcase */
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import {
    statusHelper,
    enabledHelper,
    diskMapper,
    generalMapper,
    interfaceMapper,
    productsMapper,
    repositoriesMapper
} from './dataMapper';

Object.keys(statusHelper).map(oneStatus => {
    it(`should return ${oneStatus}`, () => {
        const wrapper = shallow(statusHelper[oneStatus]);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});

Object.keys(enabledHelper).map(oneStatus => {
    it(`should return ${oneStatus}`, () => {
        const wrapper = shallow(enabledHelper[oneStatus]);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});

it('diskMapper', () => {
    expect(diskMapper([{
        device: 'device',
        label: 'label',
        mountpoint: 'mount',
        options: {
            test: 'data'
        },
        mounttype: 'type'
    }])).toMatchSnapshot();
});

it('diskMapper with values', () => {
    expect(diskMapper([{
        device: { value: 'device' },
        label: { value: 'label' },
        mountpoint: { value: 'mount' },
        options: {
            options: {
                value: { test: 'data' }
            }
        },
        mounttype: 'type'
    }])).toMatchSnapshot();
});

it('diskMapper - no data', () => {
    expect(diskMapper()).toMatchSnapshot();
});

it('generalMapper', () => {
    expect(generalMapper([
        'one',
        'two'
    ], 'test')).toMatchSnapshot();
});

it('generalMapper - no data', () => {
    expect(generalMapper()).toMatchSnapshot();
});

it('interfaceMapper', () => {
    expect(interfaceMapper([{
        mac_address: 'test-mac',
        mtu: 'test-mtu',
        name: 'test-name',
        state: 'UP',
        type: 'test-type'
    },
    {
        mac_address: 'test-mac2',
        mtu: 'test-mtu2',
        name: 'test-name2',
        state: 'DOWN',
        type: 'test-type2'
    },
    {
        mac_address: 'test-mac2',
        mtu: 'test-mtu2',
        name: 'test-name2',
        state: 'WRONG',
        type: 'test-type2'
    }
    ])).toMatchSnapshot();
});

it('interfaceMapper - no data', () => {
    expect(interfaceMapper()).toMatchSnapshot();
});

it('productsMapper', () => {
    expect(productsMapper([
        {
            name: 'test-name',
            status: true
        },
        {
            name: 'test-name',
            status: false
        },
        {
            name: 'test-name'
        }
    ])).toMatchSnapshot();
});

it('productsMapper - no data', () => {
    expect(productsMapper()).toMatchSnapshot();
});

it('repositoriesMapper', () => {
    expect(repositoriesMapper({
        enabled: [{
            base_url: 'test-url',
            name: 'test-name',
            enabled: true,
            gpgcheck: false
        },
        {
            base_url: 'test-url',
            name: 'test-name',
            enabled: true,
            gpgcheck: true
        }],
        disabled: [{
            base_url: 'test-url',
            name: 'test-name',
            enabled: false,
            gpgcheck: false
        },
        {
            base_url: 'test-url',
            name: 'test-name',
            gpgcheck: false
        }]
    })).toMatchSnapshot();
});

it('repositoriesMapper - no data', () => {
    expect(repositoriesMapper()).toMatchSnapshot();
});
