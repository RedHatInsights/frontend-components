import React from 'react';
import { render } from '@testing-library/react';
import Ansible from './Ansible';

describe('Ansible component', () => {
  describe('should render correctly', () => {
    it('unsupported boolean', () => {
      const { container } = render(<Ansible unsupported />);
      expect(container).toMatchSnapshot();
    });

    it('unsupported number', () => {
      const { container } = render(<Ansible unsupported={1} />);
      expect(container).toMatchSnapshot();
    });

    it('supported boolean', () => {
      const { container } = render(<Ansible />);
      expect(container).toMatchSnapshot();
    });

    it('supported number', () => {
      const { container } = render(<Ansible unsupported={0} />);
      expect(container).toMatchSnapshot();
    });
  });
});
