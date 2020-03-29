import buildFilterConfig from './FilterBuilderConfigBuilder';
import FilterConfigBuilder from './FilterConfigBuilder';

import ChipBuilder from './ChipBuilder';

describe('ChipBuilder#getChipsFor', () => {
    const builder = new FilterConfigBuilder(
        buildFilterConfig({ selectedFilter: true, showPassFailFilter: true, policies: [] })
    );
    let chipBuilder;

    beforeEach(() => {
        chipBuilder = new ChipBuilder(builder);
    });

    it('returns a filterConfig', () => {
        chipBuilder.chipsFor({
            passed: [ 'passed' ],
            name: 'Text search',
            selected: [ 'all' ],
            invalidFilter: ''
        }).then((results) => {
            expect(results).toMatchSnapshot();
        });
    });
});
