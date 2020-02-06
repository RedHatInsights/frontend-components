import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import SystemRulesTable from './SystemRulesTable';
import { SortByDirection } from '@patternfly/react-table';
import { TITLE_COLUMN } from './Constants';
import { remediationsResponse, system, profileRules } from './Fixtures';
import { columns } from './defaultColumns';
import debounce from 'lodash/debounce';

jest.mock('lodash/debounce');
debounce.mockImplementation(fn => fn);
global.fetch = require('jest-fetch-mock');

describe('SystemRulesTable component', () => {
    beforeEach(() => {
        fetch.mockResponse(JSON.stringify(remediationsResponse));
    });

    it('should render', () => {
        const wrapper = shallow(
            <SystemRulesTable
                profileRules={ profileRules }
                loading={ false }
                system={ system }
                columns={ columns }
            />
        );
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render without remediations if prop passed', () => {
        const wrapper = shallow(
            <SystemRulesTable
                remediationsEnabled={ false }
                profileRules={ profileRules }
                loading={ false }
                system={ system }
                columns={ columns }
            />
        );
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render a loading table', () => {
        const wrapper = shallow(
            <SystemRulesTable
                profileRules={ profileRules }
                loading={ true }
                system={ system }
                columns={ columns }
            />
        );
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render filtered rows by severity', async () => {
        const wrapper = shallow(
            <SystemRulesTable
                profileRules={ profileRules }
                loading={ false }
                system={ system }
                itemsPerPage={ 100 }
                columns={ columns }
            />
        );
        const instance = wrapper.instance();
        await instance.setInitialCurrentRows();
        expect(wrapper.state('currentRows').length / 2).toEqual(52);
        await instance.updateFilter(false, [ 'low' ], []);
        expect(wrapper.state('currentRows').length / 2).toEqual(2);
    });

    it('should render filtered rows by multiple severities', async () => {
        const wrapper = shallow(
            <SystemRulesTable
                profileRules={ profileRules }
                loading={ false }
                system={ system }
                itemsPerPage={ 100 }
                columns={ columns }
            />
        );
        const instance = wrapper.instance();
        await instance.setInitialCurrentRows();
        expect(wrapper.state('currentRows').length / 2).toEqual(52);
        await instance.updateFilter(false, [ 'high', 'medium' ], []);
        expect(wrapper.state('currentRows').length / 2).toEqual(50);
    });

    it('should render search results by rule name', async () => {
        const wrapper = shallow(
            <SystemRulesTable
                profileRules={ profileRules }
                loading={ false }
                system={ system }
                itemsPerPage={ 100 }
                columns={ columns }
            />
        );
        const instance = wrapper.instance();
        await instance.setInitialCurrentRows();
        await instance.setState({ searchTerm: 'docker' });
        await instance.updateFilter(wrapper.state('hidePassed'), wrapper.state('severity'), wrapper.state('policy'));
        expect(wrapper.update().state('currentRows').length / 2).toEqual(1);
    });

    it('should render sorted rows', async () => {
        const wrapper = shallow(
            <SystemRulesTable
                profileRules={ profileRules }
                loading={ false }
                system={ system }
                itemsPerPage={ 100 }
                columns={ columns }
            />
        );
        const instance = wrapper.instance();
        await instance.setInitialCurrentRows();
        expect(wrapper.state('currentRows').length / 2).toEqual(52);
        expect(wrapper.state('currentRows')[0].cells[TITLE_COLUMN].original).
        toEqual('Use direct-lvm with the Device Mapper Storage Driver');
        expect(wrapper.state('currentRows')[2].cells[TITLE_COLUMN].original).
        toEqual('Enable the Docker service');
        await instance.onSort(null, TITLE_COLUMN + 2, SortByDirection.asc);
        expect(wrapper.state('currentRows').length / 2).toEqual(52);
        expect(wrapper.state('currentRows')[0].cells[TITLE_COLUMN].original).
        toEqual('Add nodev Option to /dev/shm');
        expect(wrapper.state('currentRows')[2].cells[TITLE_COLUMN].original).
        toEqual('Add nosuid Option to /dev/shm');
    });

    it('should render filtered rows with the right parent fields', async () => {
        const wrapper = shallow(
            <SystemRulesTable
                profileRules={ profileRules }
                loading={ false }
                system={ system }
                itemsPerPage={ 50 }
                columns={ columns }
            />
        );
        const instance = wrapper.instance();
        await instance.setInitialCurrentRows();
        await instance.updateFilter(false, [ 'high', 'medium' ], []);
        expect(wrapper.state('currentRows').length / 2).toEqual(50);
        wrapper.state('currentRows').forEach((row, i) => {
            if (Object.prototype.hasOwnProperty.call(row, 'parent')) {
                expect(row.parent).toEqual(i - 1);
            }
        });
    });

    it('should render search results with the right parent fields', async () => {
        const wrapper = shallow(
            <SystemRulesTable
                profileRules={ profileRules }
                loading={ false }
                system={ system }
                itemsPerPage={ 50 }
                columns={ columns }
            />
        );
        const instance = wrapper.instance();
        await instance.setInitialCurrentRows();
        await instance.setState({ searchTerm: 'Disable' });
        await instance.updateFilter(wrapper.state('hidePassed'), wrapper.state('severity'), wrapper.state('policy'));
        expect(wrapper.state('currentRows').length / 2).toEqual(7);
        wrapper.state('currentRows').forEach((row, i) => {
            if (Object.prototype.hasOwnProperty.call(row, 'parent')) {
                expect(row.parent).toEqual(i - 1);
            }
        });
    });

    it('should render filtered and search mixed results with the right parent', async () => {
        const wrapper = shallow(
            <SystemRulesTable
                profileRules={ profileRules }
                loading={ false }
                system={ system }
                itemsPerPage={ 50 }
                columns={ columns }
            />
        );
        const instance = wrapper.instance();
        await instance.setInitialCurrentRows();
        await instance.setState({ searchTerm: 'Verify' });
        await instance.updateFilter(wrapper.state('hidePassed'), [ 'high' ], wrapper.state('policy'));
        expect(wrapper.state('currentRows').length / 2).toEqual(2);
        wrapper.state('currentRows').forEach((row, i) => {
            if (Object.prototype.hasOwnProperty.call(row, 'parent')) {
                expect(row.parent).toEqual(i - 1);
            }
        });
    });

    it('should render search results on any page, returning to page 1', async () => {
        const wrapper = shallow(
            <SystemRulesTable
                profileRules={ profileRules }
                loading={ false }
                system={ system }
                itemsPerPage={ 50 }
                columns={ columns }
            />
        );
        const instance = wrapper.instance();
        await instance.setInitialCurrentRows();
        await instance.setState({ page: 3 });
        await instance.setState({ searchTerm: 'Disable Odd Job Daemon' });
        await instance.updateFilter(wrapper.state('hidePassed'), wrapper.state('severity'), wrapper.state('policy'));
        expect(wrapper.state('currentRows').length / 2).toEqual(1);
        wrapper.state('currentRows').forEach((row, i) => {
            if (Object.prototype.hasOwnProperty.call(row, 'parent')) {
                expect(row.parent).toEqual(i - 1);
            }
        });
    });
});
