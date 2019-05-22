import React from 'react';
import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { RowLoader, processDate, parseCvssScore, downloadFile, mergeArraysByKey } from './helpers';

describe('mergeArraysByKey', () => {
    it('should join two arrays by ID', () => {
        const result = mergeArraysByKey([ [{
            id: '1',
            value: '5'
        }, {
            id: '2',
            value: '9'
        }],
        [{
            id: '1',
            value: '7'
        }] ]);
        expect(result.length).toBe(2);
        expect(result).toEqual(expect.arrayContaining([ expect.objectContaining({ id: '1', value: '7' }) ]));
    });

    it('should join arryas by different key', () => {
        const result = mergeArraysByKey([ [{
            key: '1',
            value: '5'
        }, {
            key: '2',
            value: '9'
        }, {
            id: '5',
            value: '4'
        }],
        [{
            key: '1',
            value: '7'
        }] ], 'key');
        expect(result.length).toBe(3);
        expect(result).toEqual(expect.arrayContaining([ expect.objectContaining({ key: '1', value: '7' }) ]));
    });
});

describe('downloadFile', () => {
    const createObjectURL = jest.fn();
    const Blob = jest.fn();
    global.URL = {
        createObjectURL
    };
    global.Blob = Blob;
    it('should call correct functions - CSV', () => {
        downloadFile({ f: 'f' });
        expect(Blob).toHaveBeenLastCalledWith([{ f: 'f' }], { type: 'text/csv;charset=utf-8;' });
        expect(createObjectURL).toHaveBeenCalled();
    });

    it('should call correct functions - JSON', () => {
        downloadFile({ f: 'f' }, 'filename', 'json');
        expect(Blob).toHaveBeenLastCalledWith([{ f: 'f' }], { type: 'data:text/json;charset=utf-8,' });
        expect(createObjectURL).toHaveBeenCalled();
    });
});

describe('parseCvssScore', () => {
    describe('no cvss', () => {
        const result = parseCvssScore();
        const wrapper = mount(result);
        it('should render N/A in span', () => {
            expect(toJson(wrapper.find('span'))).toMatchSnapshot();
        });

        it('should render correct tooltip content', () => {
            expect(toJson(wrapper.find('TooltipContent'))).toMatchSnapshot();
        });
    });

    it('cvssV3', () => {
        const result = parseCvssScore(1, 2);
        const wrapper = mount(<React.Fragment>{ result }</React.Fragment>);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    describe('cvssV2', () => {
        const result = parseCvssScore(2);
        const wrapper = mount(result);
        it('should render value in span', () => {
            expect(toJson(wrapper.find('span'))).toMatchSnapshot();
        });

        it('should render correct tooltip content', () => {
            expect(toJson(wrapper.find('TooltipContent'))).toMatchSnapshot();
        });
    });

    describe('cvssV2 with labels', () => {
        const result = parseCvssScore(2, 0, true);
        const wrapper = mount(result);
        it('should render value in span', () => {
            expect(toJson(wrapper.find('span'))).toMatchSnapshot();
        });

        it('should render correct tooltip content', () => {
            expect(toJson(wrapper.find('TooltipContent'))).toMatchSnapshot();
        });
    });
});

describe('processDate', () => {
    it('should return parsed date', () => {
        expect(processDate(1558530000000)).toBe('22 May 2019');
    });

    it('should return N/A for wrong date', () => {
        expect(processDate('')).toBe('N/A');
    });

    it('should render parse date correctly', () => {
        expect(processDate(1557000000000)).toBe('04 May 2019');

    });
});

describe('RowLoader', () => {
    it('should render correctly', () => {
        const wrapper = shallow(<RowLoader />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
