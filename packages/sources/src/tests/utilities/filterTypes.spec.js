import filterTypes from '../../utilities/filterTypes';

describe('filterTypes', () => {
    it('filters types that does not have any endpoint or authentication', () => {
        const sourceTypes = [
            { schema: { endpoint: { title: 'endpoint setup' } } }, // remove
            { schema: { authentication: [{ type: 'password' }], endpoint: { title: 'endpoint setup' } } },
            { schema: { authentication: [{ type: 'password' }] } }, // remove,
            { } // remove
        ];

        expect(sourceTypes.filter(filterTypes)).toEqual([
            { schema: { authentication: [{ type: 'password' }], endpoint: { title: 'endpoint setup' } } }
        ]);
    });
});
