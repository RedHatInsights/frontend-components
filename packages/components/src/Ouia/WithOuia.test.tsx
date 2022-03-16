import { render, screen } from '@testing-library/react';
import { OuiaDataAttributes, WithOuia } from './index';
import React from 'react';

const testId = 'helper';

const Helper: React.FunctionComponent = () => {
  return <div data-testid={testId} />;
};

describe('WithOuia', () => {
  it('By default is wrapped in a div', () => {
    const Wrapped = WithOuia(Helper, 'Helper');
    render(<Wrapped />);
    const wrapper = screen.getByTestId(testId).parentElement;
    expect(wrapper?.tagName).toEqual('DIV');
  });

  it('Can have a different dom wrapper', () => {
    const Wrapped = WithOuia(Helper, {
      type: 'Helper',
      InnerComponent: 'span',
    });
    render(<Wrapped />);
    const wrapper = screen.getByTestId(testId).parentElement;
    expect(wrapper?.tagName).toEqual('SPAN');
  });

  it('Can have a component wrapper', () => {
    const Custom: React.FunctionComponent<OuiaDataAttributes> = (props) => {
      return <ul {...props}>{props.children}</ul>;
    };

    const Wrapped = WithOuia(Helper, {
      type: 'Helper',
      InnerComponent: Custom,
    });
    render(<Wrapped />);
    const wrapper = screen.getByTestId(testId).parentElement;
    expect(wrapper?.tagName).toEqual('UL');
  });

  it('Has the component-type set', () => {
    const Wrapped = WithOuia(Helper, 'Helper');
    render(<Wrapped />);
    const wrapper = screen.getByTestId(testId).parentElement;
    expect(wrapper).toHaveAttribute('data-ouia-component-type', 'Helper');
  });

  it('Can specify a module to append to the type', () => {
    const Wrapped = WithOuia(Helper, {
      type: 'Helper',
      module: 'MyLib',
    });
    render(<Wrapped />);
    const wrapper = screen.getByTestId(testId).parentElement;
    expect(wrapper).toHaveAttribute('data-ouia-component-type', 'MyLib/Helper');
  });

  it('ouia-safe is true by default', () => {
    const Wrapped = WithOuia(Helper, {
      type: 'Helper',
    });
    render(<Wrapped />);
    const wrapper = screen.getByTestId(testId).parentElement;
    expect(wrapper).toHaveAttribute('data-ouia-safe', 'true');
  });

  it('ouia-safe is true if manually set', () => {
    const Wrapped = WithOuia(Helper, {
      type: 'Helper',
    });
    render(<Wrapped ouiaSafe={true} />);
    const wrapper = screen.getByTestId(testId).parentElement;
    expect(wrapper).toHaveAttribute('data-ouia-safe', 'true');
  });

  it('ouia-safe is false if manually set', () => {
    const Wrapped = WithOuia(Helper, {
      type: 'Helper',
    });
    render(<Wrapped ouiaSafe={false} />);
    const wrapper = screen.getByTestId(testId).parentElement;
    expect(wrapper).toHaveAttribute('data-ouia-safe', 'false');
  });

  it('ouia-component-id is not set by default', () => {
    const Wrapped = WithOuia(Helper, {
      type: 'Helper',
    });
    render(<Wrapped />);
    const wrapper = screen.getByTestId(testId).parentElement;
    expect(wrapper).not.toHaveAttribute('data-ouia-component-id');
  });

  it('allows to set the ouia-component-id', () => {
    const Wrapped = WithOuia(Helper, {
      type: 'Helper',
    });
    render(<Wrapped ouiaId="123456" />);
    const wrapper = screen.getByTestId(testId).parentElement;
    expect(wrapper?.tagName).toEqual('DIV');
    expect(wrapper).toHaveAttribute('data-ouia-component-type', 'Helper');
    expect(wrapper).toHaveAttribute('data-ouia-component-id', '123456');
  });
});
