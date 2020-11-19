import { constructValues, reloadWrapper, reduceFilters } from './constants';

describe('constructValues', () => {
    it('create empty array (no selection)', () => {
        expect(constructValues({
            something: {
                isSelected: false,
                group: {
                    meta: {
                        tag: {
                            key: 'ff',
                            value: 'fff'
                        }
                    }
                }
            }
        }).length).toBe(0);
    });

    it('should create array with one selection', () => {
        const data = constructValues({
            something: {
                isSelected: true,
                item: {
                    meta: {
                        tag: {
                            key: 'ff',
                            value: 'fff'
                        }
                    }
                },
                group: 'bla'
            },
            another: {
                isSelected: false
            }
        });
        expect(data.length).toBe(1);
        expect(data[0]).toMatchObject({ group: 'bla', key: 'something', name: 'ff=fff', tagKey: 'ff', value: 'fff' });
    });
});

describe('reloadWrapper', () => {
    it('should call callback once promise is done', async () => {
        const callback = jest.fn();
        const promise = Promise.resolve('something');
        const data = reloadWrapper({
            payload: promise
        }, callback);
        setImmediate(() => {
            expect(callback).toHaveBeenCalled();
        });
        expect(data).toBeDefined();
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
