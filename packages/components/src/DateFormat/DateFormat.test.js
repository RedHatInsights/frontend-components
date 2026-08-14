import React from 'react';
import { render } from '@testing-library/react';
import DateFormat from './DateFormat';

describe('DateFormat component', () => {
  const _Date = Date;
  const currDate = new Date('1970');
  beforeAll(() => {
    /*eslint no-global-assign:off*/
    Date = class extends Date {
      constructor(...props) {
        if (props.length > 0) {
          return new _Date(...props);
        }

        return currDate;
      }

      static now() {
        return new _Date('1970').getTime();
      }
    };
  });

  afterAll(() => {
    Date = _Date;
  });

  it('DateFormat renders with date integer', () => {
    const { container } = render(<DateFormat date={10} />);
    expect(container).toMatchSnapshot();
  });

  it('DateFormat renders with date string', () => {
    const { container } = render(<DateFormat date="Dec 31 2019 00:00:00 UTC" />);
    expect(container).toMatchSnapshot();
  });

  it('DateFormat renders with date object', () => {
    const { container } = render(<DateFormat date={new Date('Dec 31 2019 00:00:00 UTC')} />);
    expect(container).toMatchSnapshot();
  });

  it('DateFormat renders exact with date integer', () => {
    const { container } = render(<DateFormat date={10} type="exact" />);
    expect(container).toMatchSnapshot();
  });

  it('DateFormat renders onlyDate with date integer', () => {
    const { container } = render(<DateFormat date={10} type="onlyDate" />);
    expect(container).toMatchSnapshot();
  });

  it('DateFormat treats date undefined as invalid', () => {
    const { container } = render(<DateFormat date={undefined} />);
    expect(container).toMatchSnapshot();
  });

  it('DateFormat treats date null as invalid', () => {
    const { container } = render(<DateFormat date={null} />);
    expect(container).toMatchSnapshot();
  });

  it('DateFormat treats date bogus string as invalid', () => {
    const { container } = render(<DateFormat date={'x'} />);
    expect(container).toMatchSnapshot();
  });
});
