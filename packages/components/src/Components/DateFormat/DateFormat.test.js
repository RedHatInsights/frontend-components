import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import DateFormat from './DateFormat';

describe('DateFormat component', () => {
    it('DateFormat renders with date integer', () => {
        const wrapper = shallow(<DateFormat date={10}/>);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('DateFormat renders with date string', () => {
        const wrapper = shallow(<DateFormat date='Dec 31 2019 00:00:00 UTC' />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('DateFormat renders with date object', () => {
        const wrapper = shallow(<DateFormat date={new Date('Dec 31 2019 00:00:00 UTC')} />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('DateFormat renders with date integer', () => {
        const wrapper = shallow(<DateFormat date={10} type='exact'/>);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('DateFormat renders with date integer', () => {
        const wrapper = shallow(<DateFormat date={10} type='onlyDate'/>);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
