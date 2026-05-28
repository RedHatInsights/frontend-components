import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import RemediationButton from './index';

const mockScalprumComponentFn = jest.fn((_props: Record<string, unknown>) => <div data-testid="scalprum-mock">Mock</div>);
const mockScalprumComponent = React.forwardRef((props: any, ref: any) => {
  mockScalprumComponentFn({ ...props, ref });
  return (
    <div data-testid="scalprum-mock" ref={ref}>
      Mock
    </div>
  );
});
mockScalprumComponent.displayName = 'MockScalprumComponent';

jest.mock('@scalprum/react-core', () => ({
  get ScalprumComponent() {
    return mockScalprumComponent;
  },
}));

describe('RemediationButton', () => {
  beforeEach(() => {
    mockScalprumComponentFn.mockClear();
  });

  it('renders without crashing', () => {
    const { container } = render(<RemediationButton />);
    expect(container).toBeTruthy();
  });

  it('passes correct appName, module, and scope to ScalprumComponent', () => {
    render(<RemediationButton />);
    expect(mockScalprumComponentFn).toHaveBeenCalledWith(
      expect.objectContaining({
        appName: 'remediations',
        module: './RemediationButton',
        scope: 'remediations',
      }),
    );
  });

  it('forwards arbitrary props to ScalprumComponent', () => {
    render(<RemediationButton buttonTooltipContent="Fix issues" data-custom="value" />);
    expect(mockScalprumComponentFn).toHaveBeenCalledWith(
      expect.objectContaining({
        buttonTooltipContent: 'Fix issues',
        'data-custom': 'value',
      }),
    );
  });

  it('passes ErrorComponent to ScalprumComponent', () => {
    render(<RemediationButton />);
    expect(mockScalprumComponentFn).toHaveBeenCalledWith(
      expect.objectContaining({
        ErrorComponent: expect.anything(),
      }),
    );
  });

  it('forwards ref to ScalprumComponent', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<RemediationButton ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('has displayName set', () => {
    expect(RemediationButton.displayName).toBe('RemediationButton');
  });
});
