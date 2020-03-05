import applicationTypes from '../helpers/applicationTypes';
import filterApps, { TOPOLOGY_INV_NAME } from '../../utilities/filterApps';

describe('filterApps', () => {
    it('filters topology invetory app from app types', () => {
        const appTypes = applicationTypes;

        expect(appTypes.find(({ name }) => name === TOPOLOGY_INV_NAME)).toBeDefined();

        expect(appTypes.filter(filterApps).find(({ name }) => name === TOPOLOGY_INV_NAME)).toBeUndefined();
    });
});
