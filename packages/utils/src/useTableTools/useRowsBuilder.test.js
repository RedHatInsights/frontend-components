import { renderHook } from '@testing-library/react-hooks';
import useRowsBuilder from './useRowsBuilder';

describe('useRowsBuilder', () => {
    it('returns a rows configuration', () => {
        const { result } = renderHook(() =>
            useRowsBuilder([{ name: 'Item #1' }])
        );
        expect(result).toMatchSnapshot();
    });
});
