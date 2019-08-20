import React from 'react';
import { shallow, mount } from 'enzyme';
import toJson, { shallowToJson } from 'enzyme-to-json';
import InfoTable from './InfoTable';
import { sortable } from '@patternfly/react-table';

describe('InfoTable', () => {
    describe('should render', () => {
        it('no data', () => {
            const wrapper = shallow(<InfoTable />);
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('one cell', () => {
            const wrapper = shallow(<InfoTable cells={ [ 'One cell' ] } rows={ [
                'first',
                { title: 'second from title' },
                [ 'multiple', 'cells' ]
            ] } />);
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('multiple cells', () => {
            const wrapper = shallow(<InfoTable cells={ [ 'One cell', 'Second one' ] } rows={ [
                [ 'first', 'second' ],
                [{ title: 'second from title' }, 'another' ],
                [ 'multiple', 'cells' ]
            ] } />);
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('expandable set to true', () => {
            const wrapper = shallow(<InfoTable expandable cells={ [ 'One cell', 'Second one' ] } rows={ [
                [ 'first', 'second' ],
                [{ title: 'second from title' }, 'another' ],
                [ 'multiple', 'cells' ]
            ] } />);
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('onSort set', () => {
            const wrapper = shallow(<InfoTable
                onSort={ jest.fn() }
                cells={ [{ title: 'One cell', transforms: [ sortable ]}, 'Second one' ] }
                rows={ [
                    [ 'first', 'second' ],
                    [{ title: 'second from title' }, 'another' ],
                    [ 'multiple', 'cells' ]
                ] } />);
            expect(toJson(wrapper)).toMatchSnapshot();
        });
    });

    describe('api', () => {
        it('expandable should open', () => {
            const wrapper = mount(<InfoTable expandable cells={ [ 'One cell', 'Second one' ] } rows={ [
                {
                    cells: [ 'first', 'second' ]
                }, {
                    cells: [{ title: 'second from title' }]
                }, {
                    cells: [ 'multiple', 'cells' ]
                }, {
                    cells: [ 'child' ]
                }
            ] } />);
            wrapper.find('.pf-c-table__toggle button').first().simulate('click');
            wrapper.update();
            expect(shallowToJson(wrapper)).toMatchSnapshot();
        });

        it('onSort with expandable', () => {
            const onSort = jest.fn();
            const wrapper = mount(<InfoTable
                expandable
                onSort={ onSort }
                cells={ [{ title: 'One cell', transforms: [ sortable ]}, 'Second one' ] }
                rows={ [
                    {
                        cells: [ 'first', 'second' ]
                    }, {
                        cells: [{ title: 'second from title' }]
                    }, {
                        cells: [ 'multiple', 'cells' ]
                    }, {
                        cells: [ 'child' ]
                    }
                ] } />);
            wrapper.find('th.pf-c-table__sort button').first().simulate('click');
            expect(onSort.mock.calls[0][1]).toBe(0);
            expect(onSort.mock.calls[0][2]).toBe('desc');
        });

        it('onSort should be called', () => {
            const onSort = jest.fn();
            const wrapper = mount(<InfoTable
                onSort={ onSort }
                cells={ [{ title: 'One cell', transforms: [ sortable ]}, 'Second one' ] }
                rows={ [
                    [ 'first', 'second' ],
                    [{ title: 'second from title' }, 'another' ],
                    [ 'multiple', 'cells' ]
                ] } />);
            wrapper.find('th.pf-c-table__sort button').first().simulate('click');
            expect(onSort).toHaveBeenCalled();
            expect(onSort.mock.calls[0][1]).toBe(0);
            expect(onSort.mock.calls[0][2]).toBe('desc');
        });

        it('onSort should be called', () => {
            const onSort = jest.fn();
            const wrapper = mount(<InfoTable
                cells={ [{ title: 'One cell', transforms: [ sortable ]}, 'Second one' ] }
                rows={ [
                    [ 'first', 'second' ],
                    [{ title: 'second from title' }, 'another' ],
                    [ 'multiple', 'cells' ]
                ] } />);
            wrapper.find('th.pf-c-table__sort button').first().simulate('click');
            expect(onSort).not.toHaveBeenCalled();
        });
    });
});
