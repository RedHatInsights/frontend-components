import React from 'react';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import Wizard from './Wizard';

const content = [
  <div id="first" key="first">
    First
  </div>,
  <div id="second" key="second">
    Second
  </div>,
  <div id="third" key="third">
    Third
  </div>,
  <div id="fourth" key="fourth">
    Fourth
  </div>,
];

describe('Wizard component', () => {
  describe('should render correctly', () => {
    it('default', () => {
      const wrapper = shallow(<Wizard content={content} title="Some title" isOpen />);
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('large', () => {
      const wrapper = shallow(<Wizard content={content} isLarge title="Some title" isOpen />);
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('one page', () => {
      const wrapper = shallow(<Wizard content={[<div key="one">One</div>]} title="Some title" isOpen />);
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('one page confirm button', () => {
      const wrapper = mount(<Wizard content={[<div key="one">One</div>]} title="Some title" isOpen />);
      expect(wrapper.find('[action="confirm"]').first().text()).toBe('Confirm');
    });

    it('one page save button', () => {
      const wrapper = mount(<Wizard content={[<div key="one">One</div>]} confirmAction="Save" title="Some title" isOpen />);
      expect(wrapper.find('[action="confirm"]').first().text()).toBe('Save');
    });
  });

  describe('content change', () => {
    it('should happen after clicking on next', () => {
      const wrapper = mount(<Wizard content={content} title="Some title" isOpen />);
      wrapper.find('[action="next"]').first().simulate('click');
      wrapper.update();
      expect(wrapper.find('#second').length).toBe(1);
      expect(wrapper.find('#first').length).toBe(0);
    });

    it('should happen at last content', () => {
      const wrapper = mount(<Wizard content={content} title="Some title" isOpen />);
      wrapper.find('[action="next"]').first().simulate('click');
      wrapper.update();
      wrapper.find('[action="next"]').first().simulate('click');
      wrapper.update();
      wrapper.find('[action="next"]').first().simulate('click');
      wrapper.update();
      expect(wrapper.find('#fourth').length).toBe(1);
      expect(wrapper.find('[action="next"]').length).toBe(0);
      expect(wrapper.find('.pf-c-modal-box__footer > [action="confirm"]').length).toBe(1);
    });

    it('should happen at last content', () => {
      const wrapper = mount(<Wizard content={content} title="Some title" isOpen />);
      wrapper.find('[action="next"]').first().simulate('click');
      wrapper.update();
      wrapper.find('[action="next"]').first().simulate('click');
      wrapper.update();
      expect(wrapper.find('#third').length).toBe(1);
      wrapper.find('[action="back"]').first().simulate('click');
      expect(wrapper.find('#second').length).toBe(1);
    });
  });

  describe('API', () => {
    it('should not call onClose X button', () => {
      const onClose = jest.fn();
      const wrapper = mount(<Wizard content={content} title="Some title" isOpen />);
      wrapper.find('[aria-label="Close"]').first().simulate('click');
      expect(onClose.mock.calls.length).toBe(0);
    });

    it('should not call onClose on close button', () => {
      const onClose = jest.fn();
      const wrapper = mount(<Wizard content={content} title="Some title" isOpen />);
      wrapper.find('[action="cancel"]').first().simulate('click');
      expect(onClose.mock.calls.length).toBe(0);
    });

    it('should call onClose X button', () => {
      const onClose = jest.fn();
      const wrapper = mount(<Wizard content={content} title="Some title" isOpen onClose={onClose} />);
      wrapper.find('[aria-label="Close"]').first().simulate('click');
      expect(onClose.mock.calls.length).toBe(1);
    });

    it('should call onClose X button', () => {
      const onClose = jest.fn();
      const wrapper = mount(<Wizard content={content} title="Some title" isOpen onClose={onClose} />);
      wrapper.find('[action="cancel"]').first().simulate('click');
      expect(onClose.mock.calls.length).toBe(1);
    });

    it('should call close on confirm', () => {
      const onClose = jest.fn();
      const wrapper = mount(<Wizard content={content} title="Some title" isOpen onClose={onClose} />);
      wrapper.find('[action="next"]').first().simulate('click');
      wrapper.update();
      wrapper.find('[action="next"]').first().simulate('click');
      wrapper.update();
      wrapper.find('[action="next"]').first().simulate('click');
      wrapper.update();
      wrapper.find('[action="confirm"]').first().simulate('click');
      expect(onClose.mock.calls.length).toBe(1);
    });
  });
});
