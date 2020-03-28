import { FilterConfigBuilder } from './FilterConfigBuilder';
import { FILTER_CONFIGURATION } from '../constants';

import ChipBuilder from './ChipBuilder';

describe('ChipBuilder#getChipsFor', () => {
    const builder = new FilterConfigBuilder(FILTER_CONFIGURATION);
    let chipBuilder;

    beforeEach(() => {
        chipBuilder = new ChipBuilder(builder);
    });

    it('returns a filterConfig', () => {
        chipBuilder.chipsFor({
            compliant: [ 'false' ],
            name: 'Text search',
            compliancescore: [ '50-69', '70-89' ],
            invalidFilter: ''
        }).then((results) => {
            expect(results).toMatchSnapshot();
        });
    });
});
