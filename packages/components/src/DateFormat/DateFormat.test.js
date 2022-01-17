import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
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
    const wrapper = shallow(<DateFormat date={10} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('DateFormat renders with date string', () => {
    const wrapper = shallow(<DateFormat date="Dec 31 2019 00:00:00 UTC" />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('DateFormat renders with date object', () => {
    const wrapper = shallow(<DateFormat date={new Date('Dec 31 2019 00:00:00 UTC')} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('DateFormat renders exact with date integer', () => {
    const wrapper = shallow(<DateFormat date={10} type="exact" />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('DateFormat renders onlyDate with date integer', () => {
    const wrapper = shallow(<DateFormat date={10} type="onlyDate" />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('DateFormat treats date undefined as invalid', () => {
    const wrapper = shallow(<DateFormat date={undefined} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('DateFormat treats date null as invalid', () => {
    const wrapper = shallow(<DateFormat date={null} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('DateFormat treats date bogus string as invalid', () => {
    const wrapper = shallow(<DateFormat date={'x'} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
