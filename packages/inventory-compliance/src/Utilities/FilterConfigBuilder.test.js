import buildFilterConfig from './FilterBuilderConfigBuilder';
import FilterConfigBuilder from './FilterConfigBuilder';

describe('FilterConfigBuilder', () => {
    const config = buildFilterConfig({ selectedFilter: true, showPassFailFilter: true, policies: [] });
    let builder;

    beforeEach(() => {
        builder = new FilterConfigBuilder(config);
    });

    it('returns a filterConfig', () => {
        const states = {
            name: '',
            compliant: [],
            compliancescore: []
        };
        const builtConfig = builder.buildConfiguration(config, ()=> ({}), states);

        expect(builtConfig).toMatchSnapshot();
    });

    describe('categoryLabelForValue', () => {
        it('to return a matching category label', () => {
            expect(builder.categoryLabelForValue('true', 'compliant')).toMatchSnapshot();
            expect(builder.categoryLabelForValue('0-49', 'compliancescore')).toMatchSnapshot();
            expect(builder.categoryLabelForValue('Search term', 'name')).toMatchSnapshot();
        });
    });

    describe('labelForValue', () => {
        it('to return a matching label', () => {
            expect(builder.labelForValue('true', 'compliant')).toMatchSnapshot();
            expect(builder.labelForValue('0-49', 'compliancescore')).toMatchSnapshot();
            expect(builder.labelForValue('Search term', 'name')).toMatchSnapshot();
        });
    });

    describe('valueForLabel', () => {
        it('to return a matching value', () => {
            expect(builder.valueForLabel('Non-compliant', 'compliant')).toMatchSnapshot();
            expect(builder.valueForLabel('50 - 69%', 'compliancescore')).toMatchSnapshot();
            expect(builder.valueForLabel('Search term', 'name')).toMatchSnapshot();
        });
    });
});
