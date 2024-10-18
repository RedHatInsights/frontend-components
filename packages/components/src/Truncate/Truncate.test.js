import React from 'react';
import Truncate from './Truncate';
import { render } from '@testing-library/react';

const text = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
laborum.`;

describe('Truncate component', () => {
  describe('should render correctly', () => {
    [true, false].forEach((isInline) => {
      describe(isInline ? 'inline' : 'block', () => {
        it('without length specified', () => {
          const { container } = render(<Truncate text={text} inline={isInline} />);
          expect(container).toMatchSnapshot();
        });

        it('with short length', () => {
          const { container } = render(<Truncate text={text} length={2} />);
          expect(container).toMatchSnapshot();
        });

        it('clicking on expand toggles to collapse', () => {
          const { container } = render(<Truncate text={text} inline={isInline} expandText="Custom expand" collapseText="Custom collapse" />);
          container.querySelectorAll('.ins-c-expand-button')[0].click();
          expect(container).toMatchSnapshot();
        });

        it('custom expande button', () => {
          const { container } = render(<Truncate text={text} inline={isInline} expandText="Custom expand" collapseText="Custom collapse" />);
          expect(container).toMatchSnapshot();
        });

        it('custom button titles', () => {
          const { container } = render(<Truncate text={text} inline={isInline} expandText="Custom expand" collapseText="Custom collapse" />);
          container.querySelectorAll('.ins-c-expand-button')[0].click();
          expect(container).toMatchSnapshot();
        });

        it('clicking on expand toggles to collapse', () => {
          const { container } = render(<Truncate text={text} inline={isInline} expandText="Custom expand" collapseText="Custom collapse" />);
          container.querySelectorAll('.ins-c-expand-button')[0].click();
          expect(container).toMatchSnapshot();
        });

        it('custom expande button', () => {
          const { container } = render(<Truncate text={text} inline={isInline} expandText="Custom expand" collapseText="Custom collapse" />);
          expect(container).toMatchSnapshot();
        });

        it('custom button titles', () => {
          const { container } = render(<Truncate text={text} inline={isInline} expandText="Custom expand" collapseText="Custom collapse" />);
          container.querySelectorAll('.ins-c-expand-button')[0].click();
          expect(container).toMatchSnapshot();
        });

        it('when text length is less than user specified length', () => {
          const { container } = render(<Truncate text={text} inline={isInline} length={1000} />);
          expect(container).toMatchSnapshot();
        });
      });
    });
  });
});
