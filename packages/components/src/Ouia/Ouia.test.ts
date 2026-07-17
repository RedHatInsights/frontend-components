import { OuiaProps, withoutOuiaProps } from './Ouia';

describe('Ouia', () => {
  it('withoutOuiaProps removes ouiaParams', () => {
    const stuff: OuiaProps & {
      foo: number;
      bar: string;
    } = {
      ouiaId: 'foobar',
      ouiaSafe: true,
      foo: 1,
      bar: 'baz',
    };

    expect(withoutOuiaProps(stuff)).toEqual({
      foo: 1,
      bar: 'baz',
    });
  });
});
