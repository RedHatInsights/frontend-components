import { FilterConfigBuilder } from './FilterConfigBuilder';
import { FILTER_CONFIGURATION } from '../constants';

import FilterBuilder from './FilterBuilder';

describe('buildFilterString', () => {
    const configBuilder = new FilterConfigBuilder(FILTER_CONFIGURATION);
    let filterBuilder;

    beforeEach(() => {
        filterBuilder = new FilterBuilder(configBuilder);
    });

    it('returns a filterstring', () => {
        const exampleActiveFilters = {
            name: 'Name',
            compliant: [ true ],
            compliancescore: [ '0-49', '50-69' ]
        };

        expect(filterBuilder.buildFilterString(exampleActiveFilters)).toMatchSnapshot();
    });

    describe('filter building', () => {
        it('returns a base filter for name when searching', () => {
            const testExampleState = {
                name: 'Name'
            };
            expect(filterBuilder.buildFilterString(testExampleState)).toMatchSnapshot();
        });

        it('returns a filter for complianceStates', () => {
            const testExampleState = {
                compliant: [ true ]
            };
            expect(filterBuilder.buildFilterString(testExampleState)).toMatchSnapshot();
        });

        it('returns a filter for complianceStates', () => {
            const testExampleState = {
                compliancescore: [ '0-49', '50-69' ]
            };
            expect(filterBuilder.buildFilterString(testExampleState)).toMatchSnapshot();
        });
    });
});
