/* eslint-disable camelcase */
import React from 'react';
import TitleColumn from './TitleColumn';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';

describe('TitleColumn', () => {
    it('should render correctly with NO data', () => {
        const Cmp = () => TitleColumn();
        const wrapper = mount(<Cmp />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render correctly with data', () => {
        const Cmp = () => TitleColumn('something', 'some-id', { os_release: 'os_release' });
        const wrapper = mount(<Cmp />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render correctly no detail with data', () => {
        const Cmp = () => TitleColumn('something', 'some-id', { os_release: 'os_release' }, { noDetail: true });
        const wrapper = mount(<Cmp />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    describe('API', () => {
        const open = jest.fn();

        beforeEach(() => {
            Object.defineProperty(window, 'open', {
                writable: true,
                value: open
            });
        });

        it('should call onClick', () => {
            const onClick = jest.fn();
            const Cmp = () => TitleColumn(
                'something',
                'some-id',
                { os_release: 'os_release' },
                { onRowClick: onClick, loaded: true }
            );
            const wrapper = mount(<Cmp />);
            wrapper.find('a').first().simulate('click');
            expect(onClick).toHaveBeenCalled();
        });

        it('should NOT call onClick', () => {
            const onClick = jest.fn();
            const Cmp = () => TitleColumn(
                'something',
                'some-id',
                { os_release: 'os_release' },
                { onRowClick: onClick }
            );
            const wrapper = mount(<Cmp />);
            wrapper.find('a').first().simulate('click');
            expect(onClick).not.toHaveBeenCalled();
        });
    });
});
