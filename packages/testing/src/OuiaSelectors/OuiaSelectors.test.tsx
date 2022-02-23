import * as React from 'react';
import { render } from '@testing-library/react';
import { ouiaSelectors, ouiaSelectorsFor } from './OuiaSelectors';

describe('OuiaSelectors', () => {
  describe('getByOuia', () => {
    it('Throws if nothing is found', () => {
      render(<></>);
      expect(() => ouiaSelectors.getByOuia('foobar')).toThrowError();
    });

    it('Throws error when more than one match found', () => {
      render(
        <div>
          <div data-ouia-component-type="my-component" data-ouia-component-id="c1">
            <div data-ouia-component-type="foobar" />
          </div>
          <div data-ouia-component-type="my-component" data-ouia-component-id="c2">
            <div data-ouia-component-type="foobar" />
          </div>
        </div>
      );
      expect(() => ouiaSelectors.getByOuia('foobar')).toThrowError();
    });

    it('Returns found element by component type', () => {
      render(
        <div>
          <div data-ouia-component-type="foobar" id="me" />
          <div data-ouia-component-type="foobar-2" />
          <div data-ouia-component-type="foobar-3" />
        </div>
      );
      expect(ouiaSelectors.getByOuia('foobar')).toHaveAttribute('id', 'me');
    });

    it('Throws error when more than one match found when using the component-id', () => {
      render(
        <div>
          <div data-ouia-component-type="my-component" data-ouia-component-id="c1">
            <div data-ouia-component-type="foobar" data-ouia-component-id="baz" />
            <div data-ouia-component-type="foobar" />
          </div>
          <div data-ouia-component-type="my-component" data-ouia-component-id="c2">
            <div data-ouia-component-type="foobar" />
            <div data-ouia-component-type="foobar" data-ouia-component-id="baz" />
          </div>
        </div>
      );
      expect(() => ouiaSelectors.getByOuia('foobar', 'baz')).toThrowError();
    });

    it('Returns found element by component type and component id', () => {
      render(
        <div>
          <div data-ouia-component-type="my-component" data-ouia-component-id="c1">
            <div data-ouia-component-type="foobar" data-ouia-component-id="baz" id="me" />
            <div data-ouia-component-type="foobar-2" data-ouia-component-id="baz" />
          </div>
          <div data-ouia-component-type="my-component" data-ouia-component-id="c2">
            <div data-ouia-component-type="foobar" data-ouia-component-id="beef" />
            <div data-ouia-component-type="foobar-2" data-ouia-component-id="baz" />
          </div>
          <div data-ouia-component-type="foobar" />
        </div>
      );
      expect(ouiaSelectors.getByOuia('foobar', 'baz')).toHaveAttribute('id', 'me');
    });

    it('Allows chaining calls', () => {
      render(
        <div>
          <div data-ouia-component-type="my-component" data-ouia-component-id="c1">
            <div data-ouia-component-type="foobar" data-ouia-component-id="baz" id="me" />
            <div data-ouia-component-type="foobar-2" data-ouia-component-id="baz" />
          </div>
          <div data-ouia-component-type="my-component" data-ouia-component-id="c2">
            <div data-ouia-component-type="foobar" data-ouia-component-id="beef" />
            <div data-ouia-component-type="foobar" data-ouia-component-id="baz" />
          </div>
          <div data-ouia-component-type="foobar" />
        </div>
      );
      const result = ouiaSelectors.getByOuia('my-component', 'c1').getByOuia('foobar');
      const result2 = ouiaSelectors.getByOuia('my-component', 'c2').getAllByOuia('foobar');

      expect(result).toHaveAttribute('id', 'me');
      expect(result2).toHaveLength(2);
    });
  });

  describe('queryByOuia', () => {
    it('Returns null nothing is found', () => {
      render(<></>);
      expect(ouiaSelectors.queryByOuia('foobar')).toBeNull();
    });

    it('Throws error when more than one match found', () => {
      render(
        <div>
          <div data-ouia-component-type="my-component" data-ouia-component-id="c1">
            <div data-ouia-component-type="foobar" />
          </div>
          <div data-ouia-component-type="my-component" data-ouia-component-id="c2">
            <div data-ouia-component-type="foobar" />
          </div>
        </div>
      );
      expect(() => ouiaSelectors.queryByOuia('foobar')).toThrowError();
    });

    it('Returns found element by component type', () => {
      render(
        <div>
          <div data-ouia-component-type="foobar" id="me" />
          <div data-ouia-component-type="foobar-2" />
          <div data-ouia-component-type="foobar-3" />
        </div>
      );
      expect(ouiaSelectors.queryByOuia('foobar')).toHaveAttribute('id', 'me');
    });

    it('Throws error when more than one match found when using the component-id', () => {
      render(
        <div>
          <div data-ouia-component-type="my-component" data-ouia-component-id="c1">
            <div data-ouia-component-type="foobar" data-ouia-component-id="baz" />
            <div data-ouia-component-type="foobar" />
          </div>
          <div data-ouia-component-type="my-component" data-ouia-component-id="c2">
            <div data-ouia-component-type="foobar" />
            <div data-ouia-component-type="foobar" data-ouia-component-id="baz" />
          </div>
        </div>
      );
      expect(() => ouiaSelectors.queryByOuia('foobar', 'baz')).toThrowError();
    });

    it('Returns found element by component type and component id', () => {
      render(
        <div>
          <div data-ouia-component-type="my-component" data-ouia-component-id="c1">
            <div data-ouia-component-type="foobar" data-ouia-component-id="baz" id="me" />
            <div data-ouia-component-type="foobar-2" data-ouia-component-id="baz" />
          </div>
          <div data-ouia-component-type="my-component" data-ouia-component-id="c2">
            <div data-ouia-component-type="foobar" data-ouia-component-id="beef" />
            <div data-ouia-component-type="foobar-2" data-ouia-component-id="baz" />
          </div>
          <div data-ouia-component-type="foobar" />
        </div>
      );
      expect(ouiaSelectors.queryByOuia('foobar', 'baz')).toHaveAttribute('id', 'me');
    });
  });

  describe('getAllByOuia', () => {
    it('Throws if nothing is found', () => {
      render(<></>);
      expect(() => ouiaSelectors.getAllByOuia('foobar')).toThrowError();
    });

    it('Return multiple matches', () => {
      render(
        <div>
          <div data-ouia-component-type="my-component" data-ouia-component-id="c1">
            <div data-ouia-component-type="foobar" />
          </div>
          <div data-ouia-component-type="my-component" data-ouia-component-id="c2">
            <div data-ouia-component-type="foobar" />
          </div>
        </div>
      );
      expect(ouiaSelectors.getAllByOuia('foobar')).toHaveLength(2);
    });

    it('Returns only element found by type', () => {
      render(
        <div>
          <div data-ouia-component-type="foobar" id="me" />
          <div data-ouia-component-type="foobar-2" />
          <div data-ouia-component-type="foobar-3" />
        </div>
      );
      const result = ouiaSelectors.getAllByOuia('foobar');
      expect(result).toHaveLength(1);
      expect(result[0]).toHaveAttribute('id', 'me');
    });

    it('Return multiple elements with the same id', () => {
      render(
        <div>
          <div data-ouia-component-type="my-component" data-ouia-component-id="c1">
            <div data-ouia-component-type="foobar" data-ouia-component-id="baz" />
            <div data-ouia-component-type="foobar" />
          </div>
          <div data-ouia-component-type="my-component" data-ouia-component-id="c2">
            <div data-ouia-component-type="foobar" />
            <div data-ouia-component-type="foobar" data-ouia-component-id="baz" />
          </div>
        </div>
      );

      const result = ouiaSelectors.getAllByOuia('foobar', 'baz');
      expect(result).toHaveLength(2);
    });

    it('Returns found element by component type and component id', () => {
      render(
        <div>
          <div data-ouia-component-type="my-component" data-ouia-component-id="c1">
            <div data-ouia-component-type="foobar" data-ouia-component-id="baz" id="me" />
            <div data-ouia-component-type="foobar-2" data-ouia-component-id="baz" />
          </div>
          <div data-ouia-component-type="my-component" data-ouia-component-id="c2">
            <div data-ouia-component-type="foobar" data-ouia-component-id="baz" />
            <div data-ouia-component-type="foobar-2" data-ouia-component-id="baz" />
          </div>
          <div data-ouia-component-type="foobar" />
        </div>
      );

      const results = ouiaSelectors.getAllByOuia('foobar', 'baz');
      expect(results).toHaveLength(2);
    });
  });

  describe('queryAllByOuia', () => {
    it('Returns 0-length array nothing is found', () => {
      render(<></>);
      expect(ouiaSelectors.queryAllByOuia('foobar')).toHaveLength(0);
    });

    it('Return multiple matches', () => {
      render(
        <div>
          <div data-ouia-component-type="my-component" data-ouia-component-id="c1">
            <div data-ouia-component-type="foobar" />
          </div>
          <div data-ouia-component-type="my-component" data-ouia-component-id="c2">
            <div data-ouia-component-type="foobar" />
          </div>
        </div>
      );
      expect(ouiaSelectors.queryAllByOuia('foobar')).toHaveLength(2);
    });

    it('Returns only element found by type', () => {
      render(
        <div>
          <div data-ouia-component-type="foobar" id="me" />
          <div data-ouia-component-type="foobar-2" />
          <div data-ouia-component-type="foobar-3" />
        </div>
      );
      const result = ouiaSelectors.queryAllByOuia('foobar');
      expect(result).toHaveLength(1);
      expect(result[0]).toHaveAttribute('id', 'me');
    });

    it('Return multiple elements with the same id', () => {
      render(
        <div>
          <div data-ouia-component-type="my-component" data-ouia-component-id="c1">
            <div data-ouia-component-type="foobar" data-ouia-component-id="baz" />
            <div data-ouia-component-type="foobar" />
          </div>
          <div data-ouia-component-type="my-component" data-ouia-component-id="c2">
            <div data-ouia-component-type="foobar" />
            <div data-ouia-component-type="foobar" data-ouia-component-id="baz" />
          </div>
        </div>
      );

      const result = ouiaSelectors.queryAllByOuia('foobar', 'baz');
      expect(result).toHaveLength(2);
    });

    it('Returns found element by component type and component id', () => {
      render(
        <div>
          <div data-ouia-component-type="my-component" data-ouia-component-id="c1">
            <div data-ouia-component-type="foobar" data-ouia-component-id="baz" id="me" />
            <div data-ouia-component-type="foobar-2" data-ouia-component-id="baz" />
          </div>
          <div data-ouia-component-type="my-component" data-ouia-component-id="c2">
            <div data-ouia-component-type="foobar" data-ouia-component-id="baz" />
            <div data-ouia-component-type="foobar-2" data-ouia-component-id="baz" />
          </div>
          <div data-ouia-component-type="foobar" />
        </div>
      );

      const results = ouiaSelectors.queryAllByOuia('foobar', 'baz');
      expect(results).toHaveLength(2);
    });
  });

  describe('ouiaSelectorsFor', () => {
    it('Uses the passed element as the base', () => {
      render(
        <div>
          <div data-ouia-component-type="my-component" data-ouia-component-id="c1">
            <div data-ouia-component-type="foobar" data-ouia-component-id="baz" id="me" />
            <div data-ouia-component-type="foobar-2" data-ouia-component-id="baz" />
          </div>
          <div data-ouia-component-type="my-component" data-ouia-component-id="c2" id="my-element">
            <div data-ouia-component-type="foobar" data-ouia-component-id="baz" id="31415" />
            <div data-ouia-component-type="foobar-2" data-ouia-component-id="baz" />
          </div>
          <div data-ouia-component-type="foobar" />
        </div>
      );
      expect(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        ouiaSelectorsFor(document.getElementById('my-element')!).getByOuia('foobar')
      ).toHaveAttribute('id', '31415');
    });

    it('Has getAllByOuia', () => {
      render(
        <div>
          <div data-ouia-component-type="my-component" data-ouia-component-id="c1">
            <div data-ouia-component-type="foobar" data-ouia-component-id="baz" id="me" />
            <div data-ouia-component-type="foobar-2" data-ouia-component-id="baz" />
          </div>
          <div data-ouia-component-type="my-component" data-ouia-component-id="c2" id="my-element">
            <div data-ouia-component-type="foobar" data-ouia-component-id="baz" id="31415" />
            <div data-ouia-component-type="foobar-2" data-ouia-component-id="baz" />
          </div>
          <div data-ouia-component-type="foobar" />
        </div>
      );
      expect(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        ouiaSelectorsFor(document.getElementById('my-element')!).getAllByOuia('foobar')
      ).toHaveLength(1);
    });

    it('Has queryByOuia', () => {
      render(
        <div>
          <div data-ouia-component-type="my-component" data-ouia-component-id="c1">
            <div data-ouia-component-type="foobar" data-ouia-component-id="baz" id="me" />
            <div data-ouia-component-type="foobar-2" data-ouia-component-id="baz" />
          </div>
          <div data-ouia-component-type="my-component" data-ouia-component-id="c2" id="my-element">
            <div data-ouia-component-type="foobar" data-ouia-component-id="baz" id="31415" />
            <div data-ouia-component-type="foobar-2" data-ouia-component-id="baz" />
          </div>
          <div data-ouia-component-type="foobar" />
        </div>
      );
      expect(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        ouiaSelectorsFor(document.getElementById('my-element')!).queryByOuia('foobar')
      ).toHaveAttribute('id', '31415');
    });

    it('Has queryAllByOuia', () => {
      render(
        <div>
          <div data-ouia-component-type="my-component" data-ouia-component-id="c1">
            <div data-ouia-component-type="foobar" data-ouia-component-id="baz" id="me" />
            <div data-ouia-component-type="foobar-2" data-ouia-component-id="baz" />
          </div>
          <div data-ouia-component-type="my-component" data-ouia-component-id="c2" id="my-element">
            <div data-ouia-component-type="foobar" data-ouia-component-id="baz" id="31415" />
            <div data-ouia-component-type="foobar-2" data-ouia-component-id="baz" />
          </div>
          <div data-ouia-component-type="foobar" />
        </div>
      );
      expect(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        ouiaSelectorsFor(document.getElementById('my-element')!).queryAllByOuia('foobar4')
      ).toHaveLength(0);
    });
  });
});
