import { renderHook } from '@testing-library/react-hooks';
import { conditionalFilterType } from '@redhat-cloud-services/frontend-components/ConditionalFilter';

import useFilterConfig from './useFilterConfig';
const config = [
    {
        type: conditionalFilterType.checkbox,
        label: 'Filter with multiple spaces',
        items: [
            { label: 'Show ', value: 'show' }
        ],
        filter: () => ([])
    },
    {
        type: conditionalFilterType.text,
        label: 'Name',
        filter: () => ([])
    }
];

describe('useFilterConfig', () => {
    it('returns a filter config configuration', () => {
        const { result } = renderHook(() => useFilterConfig(config));
        expect(result).toMatchSnapshot();
    });
});
