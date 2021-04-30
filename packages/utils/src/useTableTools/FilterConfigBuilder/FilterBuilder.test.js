import FilterConfigBuilder from './FilterConfigBuilder';
import FilterBuilder from './FilterBuilder';
import { exampleFilters } from '../__fixtures__/filters';

describe('buildFilterString', () => {
    const configBuilder = new FilterConfigBuilder(exampleFilters);
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

        it('returns a filter for compliant', () => {
            const testExampleState = {
                compliant: [ true ]
            };
            expect(filterBuilder.buildFilterString(testExampleState)).toMatchSnapshot();
        });

        it('returns a filter for scores', () => {
            const testExampleState = {
                systemsmeetingcompliance: [ '0-49', '50-69' ]
            };
            expect(filterBuilder.buildFilterString(testExampleState)).toMatchSnapshot();
        });
    });
});
