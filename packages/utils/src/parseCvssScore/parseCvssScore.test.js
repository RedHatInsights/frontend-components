import React from 'react';
import parseCvssScore from './parseCvssScore';
import { render } from '@testing-library/react';

describe('parseCvssScore', () => {
  describe('no cvss', () => {
    const result = parseCvssScore();
    const { container } = render(result);
    it('render', () => {
      expect(container).toMatchSnapshot();
    });
  });

  it('cvssV3', () => {
    const result = parseCvssScore(1, 2);
    const { container } = render(<React.Fragment>{result}</React.Fragment>);
    expect(container).toMatchSnapshot();
  });

  describe('cvssV2', () => {
    const result = parseCvssScore(2);
    const { container } = render(result);
    it('should render v2 cvss', () => {
      expect(container).toMatchSnapshot();
    });
  });

  describe('cvssV2 with labels', () => {
    const result = parseCvssScore(2, 0, true);
    const { container } = render(result);
    it('should render v2 cvss with label', () => {
      expect(container).toMatchSnapshot();
    });

    it('should render correct tooltip content', () => {
      expect(container).toMatchSnapshot();
    });
  });
});
