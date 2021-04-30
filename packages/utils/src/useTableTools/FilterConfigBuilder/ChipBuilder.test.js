import { exampleFilters } from '../__fixtures__/filters';
import FilterConfigBuilder from './FilterConfigBuilder';

import ChipBuilder from './ChipBuilder';

describe('ChipBuilder#getChipsFor', () => {
    const builder = new FilterConfigBuilder(exampleFilters);
    let chipBuilder;

    beforeEach(() => {
        chipBuilder = new ChipBuilder(builder);
    });

    it('returns a filterConfig', () => {
        const chips = chipBuilder.chipsFor({
            passed: [ 'passed' ],
            name: 'Text search',
            selected: [ 'all' ],
            invalidFilter: ''
        });
        expect(chips).toMatchSnapshot();
    });
});
