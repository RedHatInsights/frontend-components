import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Shield from './Shield';

describe('Shield component', () => {
    it('should render without props', () => {
        const wrapper = shallow(<Shield />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render where impact value is undefined', () => {
        const wrapper = shallow(<Shield impact={ undefined } />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render where impact value is empty string', () => {
        const wrapper = shallow(<Shield impact={ '' } />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render where impact value is Low and tooltipPrefix is Severity: ', () => {
        const wrapper = shallow(<Shield impact={ 'Low' } tooltipPrefix={ 'Severity: ' } />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render where impact value is Critical', () => {
        const wrapper = shallow(<Shield impact={ 'Critical' } />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render where impact value is 4', () => {
        const wrapper = shallow(<Shield impact={ 4 } />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render where impact value is 3', () => {
        const wrapper = shallow(<Shield impact={ 3 } />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render where impact value is 2', () => {
        const wrapper = shallow(<Shield impact={ 2 } />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render where impact value is 1', () => {
        const wrapper = shallow(<Shield impact={ 1 } />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render where impact value is NonExist', () => {
        const wrapper = shallow(<Shield impact={ 'NonExist' } />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render where impact value is Medium and tooltipPosition is bottom', () => {
        const wrapper = shallow(<Shield impact={ 'Medium' } tooltipPosition={ 'bottom' } />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render where impact value is Medium and tooltipPosition is notValid', () => {
        const wrapper = shallow(<Shield impact={ 'Medium' } tooltipPosition={ 'notValid' } />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render where impact value is Low and title is Hello world', () => {
        const wrapper = shallow(<Shield impact={ 'Low' } title={ 'Hello world' } />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render where title is Hello world', () => {
        const wrapper = shallow(<Shield title={ 'Hello world' } />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render where title is Hello world and hasTooltip is true', () => {
        const wrapper = shallow(<Shield title={ 'Hello world' } hasTooltip={ true } />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
