import FilterConfigBuilder from './FilterConfigBuilder';
import { exampleFilters } from '../__fixtures__/filters';

describe('FilterConfigBuilder', () => {
    let builder;

    beforeEach(() => {
        builder = new FilterConfigBuilder(exampleFilters);
    });

    it('returns a filterConfig', () => {
        const states = {
            name: '',
            compliant: [],
            compliancescore: []
        };
        const builtConfig = builder.buildConfiguration(exampleFilters, ()=> ({}), states);

        expect(builtConfig).toMatchSnapshot();
    });
    describe('initialDefaultState', () => {
        it('to return a matching category label', () => {
            expect(builder.initialDefaultState()).toMatchSnapshot();
        });
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
