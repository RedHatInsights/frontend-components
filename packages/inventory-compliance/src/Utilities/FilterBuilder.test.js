import { conditionalFilterType } from '@redhat-cloud-services/frontend-components/components/ConditionalFilter';
import FilterConfigBuilder from './FilterConfigBuilder';
import FilterBuilder from './FilterBuilder';

const FILTER_CONFIGURATION = [
    {
        type: conditionalFilterType.text,
        label: 'Name',
        filterString: (value) => (`name ~ ${value}`)
    },
    {
        type: conditionalFilterType.checkbox,
        label: 'Compliant',
        filterString: (value) => (`compliant = ${value}`),
        items: [
            { label: 'Compliant', value: 'true' },
            { label: 'Non-compliant', value: 'false' }
        ]
    },
    {
        type: conditionalFilterType.checkbox,
        label: 'Compliance score',
        filterString: (value) => {
            const scoreRange = value.split('-');
            return `compliance_score >= ${scoreRange[0]} and compliance_score <= ${scoreRange[1]}`;
        },
        items: [
            { label: '90 - 100%', value: '90-100' },
            { label: '70 - 89%', value: '70-89' },
            { label: '50 - 69%', value: '50-69' },
            { label: 'Less than 50%', value: '0-49' }
        ]
    }
];

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
