import React from 'react';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import SystemRulesTable from './SystemRulesTable';
import { IntlProvider } from 'react-intl';
import { SortByDirection } from '@patternfly/react-table';
import { TITLE_COLUMN } from './Constants';
import { remediationsResponse, system, profileRules } from './Fixtures';
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
            />
        );
        const instance = wrapper.instance();
        await instance.setInitialCurrentRows();
        expect(wrapper.state('currentRows').length / 2).toEqual(2);
        await instance.updateFilter(false, ['high'], []);
        expect(wrapper.state('currentRows').length / 2).toEqual(0);
    });

    it('should render filtered rows by multiple severities', async () => {
        const wrapper = shallow(
            <SystemRulesTable
                profileRules={ profileRules }
                loading={ false }
                system={ system }
            />
        );
        const instance = wrapper.instance();
        await instance.setInitialCurrentRows();
        expect(wrapper.state('currentRows').length / 2).toEqual(2);
        await instance.updateFilter(false, ['high', 'medium'], []);
        expect(wrapper.state('currentRows').length / 2).toEqual(1);
    });

    it('should render search results by rule name', async () => {
        const wrapper = shallow(
            <SystemRulesTable
                profileRules={ profileRules }
                loading={ false }
                system={ system }
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
            />
        );
        const instance = wrapper.instance();
        await instance.setInitialCurrentRows();
        expect(wrapper.state('currentRows').length / 2).toEqual(2);
        expect(wrapper.state('currentRows')[0].cells[TITLE_COLUMN].original).
        toEqual('Use direct-lvm with the Device Mapper Storage Driver');
        expect(wrapper.state('currentRows')[2].cells[TITLE_COLUMN].original).
        toEqual('Enable the Docker service');
        await instance.onSort(null, TITLE_COLUMN + 2, SortByDirection.asc);
        expect(wrapper.state('currentRows').length / 2).toEqual(2);
        expect(wrapper.state('currentRows')[0].cells[TITLE_COLUMN].original).
        toEqual('Enable the Docker service');
        expect(wrapper.state('currentRows')[2].cells[TITLE_COLUMN].original).
        toEqual('Use direct-lvm with the Device Mapper Storage Driver');
    });
});
