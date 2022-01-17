import React from 'react';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import Pagination, { dropDirection } from './Pagination';

describe('Pagination component', () => {
  describe('should render', () => {
    it('required props', () => {
      const wrapper = shallow(<Pagination numberOfItems={10} />);
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('per page options', () => {
      const wrapper = shallow(<Pagination numberOfItems={10} perPageOptions={[1, 2]} />);
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('items per page', () => {
      const wrapper = shallow(<Pagination numberOfItems={10} itemsPerPage={20} />);
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('direction up', () => {
      const wrapper = shallow(<Pagination numberOfItems={10} direction={dropDirection.up} />);
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('empty page', () => {
      const wrapper = shallow(<Pagination numberOfItems={0} />);
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    describe('page', () => {
      it('second', () => {
        const wrapper = shallow(<Pagination numberOfItems={30} page={2} />);
        expect(toJson(wrapper)).toMatchSnapshot();
      });

      it('last', () => {
        const wrapper = shallow(<Pagination numberOfItems={30} page={3} />);
        expect(toJson(wrapper)).toMatchSnapshot();
      });
    });
  });
  describe('API', () => {
    describe('onSetPage', () => {
      it('first page', () => {
        const onSetPage = jest.fn();
        const wrapper = mount(<Pagination numberOfItems={30} onSetPage={onSetPage} page={2} />);
        wrapper.find('[data-action="first-page"]').first().simulate('click');
        expect(onSetPage.mock.calls[0][0]).toBe(1);
        expect(onSetPage.mock.calls[0][1]).toBe(false);
      });

      it('last page', () => {
        const onSetPage = jest.fn();
        const wrapper = mount(<Pagination numberOfItems={30} onSetPage={onSetPage} page={2} />);
        wrapper.find('[data-action="last-page"]').first().simulate('click');
        expect(onSetPage.mock.calls[0][0]).toBe(3);
        expect(onSetPage.mock.calls[0][1]).toBe(false);
      });

      it('previous page', () => {
        const onSetPage = jest.fn();
        const wrapper = mount(<Pagination numberOfItems={30} onSetPage={onSetPage} page={2} />);
        wrapper.find('[data-action="previous-page"]').first().simulate('click');
        expect(onSetPage.mock.calls[0][0]).toBe(1);
        expect(onSetPage.mock.calls[0][1]).toBe(false);
      });

      it('next page', () => {
        const onSetPage = jest.fn();
        const wrapper = mount(<Pagination numberOfItems={30} onSetPage={onSetPage} page={2} />);
        wrapper.find('[data-action="next-page"]').first().simulate('click');
        expect(onSetPage.mock.calls[0][0]).toBe(3);
        expect(onSetPage.mock.calls[0][1]).toBe(false);
      });

      describe('input', () => {
        it('number', () => {
          const onSetPage = jest.fn();
          const wrapper = mount(<Pagination numberOfItems={30} onSetPage={onSetPage} page={3} />);
          const input = wrapper.find('input[data-action="set-page"]').first();
          input.getDOMNode().value = 1;
          input.simulate('change');
          expect(onSetPage.mock.calls[0][0]).toBe(1);
          expect(onSetPage.mock.calls[0][1]).toBe(true);
        });

        it('large', () => {
          const onSetPage = jest.fn();
          const wrapper = mount(<Pagination numberOfItems={30} onSetPage={onSetPage} page={2} />);
          const input = wrapper.find('input[data-action="set-page"]').first();
          input.getDOMNode().value = 150;
          input.simulate('change');
          expect(onSetPage.mock.calls[0][0]).toBe(3);
          expect(onSetPage.mock.calls[0][1]).toBe(true);
        });

        it('string', () => {
          const onSetPage = jest.fn();
          const wrapper = mount(<Pagination numberOfItems={30} onSetPage={onSetPage} page={2} />);
          const input = wrapper.find('input[data-action="set-page"]').first();
          input.getDOMNode().value = 'bad';
          input.simulate('change');
          expect(onSetPage.mock.calls[0][0]).toBe(2);
          expect(onSetPage.mock.calls[0][1]).toBe(true);
        });

        it('negative page', () => {
          const onSetPage = jest.fn();
          const wrapper = mount(<Pagination numberOfItems={30} onSetPage={onSetPage} page={2} />);
          const input = wrapper.find('input[data-action="set-page"]').first();
          input.getDOMNode().value = -1;
          input.simulate('change');
          expect(onSetPage.mock.calls[0][0]).toBe(0);
          expect(onSetPage.mock.calls[0][1]).toBe(true);
        });
      });
    });

    it('onPerPageSelect', () => {
      const onPerPageSelect = jest.fn();
      const wrapper = mount(<Pagination numberOfItems={30} onPerPageSelect={onPerPageSelect} />);
      wrapper.find('.pf-c-options-menu__toggle-button').first().simulate('click');
      wrapper.update();
      wrapper.find('.pf-c-options-menu__toggle ul li button').at(2).simulate('click');
      expect(onPerPageSelect.mock.calls.length).toBe(1);
      expect(onPerPageSelect.mock.calls[0][0]).toBe(20);
    });

    it('onFirstPage', () => {
      const onFirstPage = jest.fn();
      const wrapper = mount(<Pagination numberOfItems={30} onFirstPage={onFirstPage} page={2} />);
      wrapper.find('[data-action="first-page"]').first().simulate('click');
      expect(onFirstPage.mock.calls.length).toBe(1);
    });

    it('onLastPage', () => {
      const onLastPage = jest.fn();
      const wrapper = mount(<Pagination numberOfItems={30} onLastPage={onLastPage} />);
      wrapper.find('[data-action="last-page"]').first().simulate('click');
      expect(onLastPage.mock.calls.length).toBe(1);
    });

    it('onPreviousPage', () => {
      const onPreviousPage = jest.fn();
      const wrapper = mount(<Pagination numberOfItems={30} onPreviousPage={onPreviousPage} page={2} />);
      wrapper.find('[data-action="previous-page"]').first().simulate('click');
      expect(onPreviousPage.mock.calls.length).toBe(1);
    });

    it('onNextPage', () => {
      const onNextPage = jest.fn();
      const wrapper = mount(<Pagination numberOfItems={30} onNextPage={onNextPage} page={2} />);
      wrapper.find('[data-action="next-page"]').first().simulate('click');
      expect(onNextPage.mock.calls.length).toBe(1);
    });
  });
});
