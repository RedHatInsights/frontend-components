import { reloadWrapper, reduceFilters } from './constants';

describe('reloadWrapper', () => {
    it('should call callback once promise is done', async () => {
        const callback = jest.fn();
        const promise = Promise.resolve('something');
        const data = reloadWrapper({
            payload: promise
        }, callback);
        expect(data).toBeDefined();
        await promise;
        expect(callback).toHaveBeenCalled();
    });
});

describe('reduceFilters', () => {
    it('should calculate TEXT_FILTER', () => {
        const data = reduceFilters([{
            value: 'hostname_or_id',
            filter: 'something'
        }]);
        expect(data.textFilter).toBe('something');
    });

    it('should calculate tagFilters', () => {
        const data = reduceFilters([{
            tagFilters: [{
                key: 'something',
                values: [{ key: 'test', tagKey: 'test', value: 'some', group: 'another' }]
            }]
        }]);
        expect(data.tagFilters).toMatchObject({ something: { test: { group: 'another', isSelected: true, item: { meta: { tag: { key: 'test', value: 'some' } } } } } });
    });

    it('should calculate staleFilter', () => {
        const data = reduceFilters([{
            staleFilter: 'something'
        }]);
        expect(data.staleFilter).toBe('something');
    });

    it('should calculate registeredWithFilter', () => {
        const data = reduceFilters([{
            registeredWithFilter: 'something'
        }]);
        expect(data.registeredWithFilter).toBe('something');
    });
});
