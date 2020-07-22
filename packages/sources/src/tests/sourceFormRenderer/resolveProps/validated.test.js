import React from 'react';
import mount from '../../__mocks__/mount';
import validated, { ValidatingSpinner } from '../../../sourceFormRenderer/resolveProps/validated';
import { Spinner, FormHelperText } from '@patternfly/react-core';

describe('resolveProps - validated', () => {
    it('Spinner is renderer correctly', () => {
        const wrapper = mount(<ValidatingSpinner />);

        expect(wrapper.find(Spinner)).toHaveLength(1);
        expect(wrapper.find(FormHelperText).text()).toEqual('Validating');
    });

    const props = {};

    it('returns spinner when validating', () => {
        expect(validated(props, { meta: { validating: true } })).toEqual({
            helperText: expect.any(Object)
        });

        expect(
            mount(validated(props, { meta: { validating: true } }).helperText).find(ValidatingSpinner)
        ).toHaveLength(1);
    });

    it('returns success state when valid', () => {
        expect(validated(props, { meta: { valid: true } })).toEqual({
            validated: 'success',
            FormGroupProps: {
                validated: 'success'
            }
        });
    });

    it('return empty object when not valid and not validating', () => {
        expect(validated(props, { meta: { valid: false, validating: false } })).toEqual({});
    });
});
