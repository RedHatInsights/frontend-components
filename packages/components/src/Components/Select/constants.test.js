import React from 'react';
import { SelectVariant, variantToSelect, calculateMulti, calculateOption } from './constants';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

describe('variantToSelect', () => {
    it('should return default', () => {
        const Component = variantToSelect('some-really');
        const wrapper = shallow(<Component />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    Object.keys(SelectVariant).map((variant) => {
        it(`variant - key ${variant} - ${SelectVariant[variant]}`, () => {
            const Component = variantToSelect(SelectVariant[variant]);
            const wrapper = shallow(<Component />);
            expect(toJson(wrapper)).toMatchSnapshot();
        });
    });
});

describe('calculateMulti', () => {
    describe('isMulti', () => {
        it('NOT contains', () => {
            expect(calculateMulti([{ value: 'one' }], ['two'], true)).toEqual([]);
        });

        it('DOES contains', () => {
            expect(calculateMulti([{ value: 'one' }, { value: 'two' }], ['one'], true)).toEqual([{value: 'one'}]);
        });
    });

    describe('single value', () => {
        it('NOT contains', () => {
            expect(calculateMulti([{value: 'one'}], 'two', false)).toEqual([]);
        });

        it('DOES contains', () => {
            expect(calculateMulti([{value: 'one'}, {value: 'two'}], 'one', false)).toEqual([{value: 'one'}]);
        });
    });
});

describe('calculateOption', () => {
    it('no option', () => {
        expect(calculateOption(undefined, true)).toBe(undefined);
        expect(calculateOption(undefined, false)).toBe(undefined);
    });

    it('isMulti', () => {
        expect(calculateOption([{value: 'one'}, {value: 'two'}], true)).toEqual(['one', 'two']);
    });

    it('object value', () => {
        expect(calculateOption({value: 'one'}, false)).toBe('one');
    });

    it('simple value', () => {
        expect(calculateOption('one', false)).toBe('one');
    });
});
