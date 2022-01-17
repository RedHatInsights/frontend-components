import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Ansible from './Ansible';

describe('Ansible component', () => {
  describe('should render correctly', () => {
    it('unsupported boolean', () => {
      const wrapper = shallow(<Ansible unsupported />);
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('unsupported number', () => {
      const wrapper = shallow(<Ansible unsupported={1} />);
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('supported boolean', () => {
      const wrapper = shallow(<Ansible />);
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('supported number', () => {
      const wrapper = shallow(<Ansible unsupported={0} />);
      expect(toJson(wrapper)).toMatchSnapshot();
    });
  });
});
