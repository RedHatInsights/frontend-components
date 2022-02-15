import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import useDedicatedAction from './useDedicatedAction';

describe('useDedicatedAction', () => {
  it('returns a dedicated action toolbar config', () => {
    const { result } = renderHook(() =>
      useDedicatedAction({
            dedicatedAction: () => ( //eslint-disable-line
          <span>DEDICATED ACTION</span>
        ),
            additionalDedicatedActions: [() => ( //eslint-disable-line
            <span>ANOTHER DEDICATED ACTION</span>
          ),
        ],
        selected: [],
      })
    );
    expect(result).toMatchSnapshot();
  });
});
