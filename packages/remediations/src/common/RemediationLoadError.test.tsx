import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import RemediationLoadError from './RemediationLoadError';

describe('RemediationLoadError', () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('renders error message', () => {
    const { getByText } = render(<RemediationLoadError component="RemediationButton" />);
    expect(getByText('Unable to load remediations component')).toBeInTheDocument();
    expect(getByText(/Failed to load RemediationButton/i)).toBeInTheDocument();
  });

  it('logs console.error with component name', () => {
    render(<RemediationLoadError component="RemediationButton" />);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Unable to load remediations component. Failed to load RemediationButton.',
      {}
    );
  });

  it('logs console.error with additional props', () => {
    const extraProps = { foo: 'bar', baz: 123 };
    render(<RemediationLoadError component="RemediationWizard" {...extraProps} />);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Unable to load remediations component. Failed to load RemediationWizard.',
      extraProps
    );
  });
});
