import React from 'react';
import { act } from 'react-dom/test-utils';
import Actions, { actionPropsGenerator, overflowActionsMapper } from './Actions';
import { render, screen } from '@testing-library/react';

const onButtonClick = jest.fn();

const actions = [
  <button onClick={onButtonClick} key="btn">
    Some button
  </button>,
  {
    label: 'Some title',
    onClick: jest.fn(),
  },
  {
    label: 'Custom props',
    props: {
      key: 'some-key',
    },
  },
  'plain string',
];

describe('Actions - component', () => {
  describe('should render', () => {
    it('no data', () => {
      const { container } = render(<Actions />);
      expect(container).toMatchSnapshot();
    });

    it('just actions', () => {
      const { container } = render(<Actions actions={actions} />);
      expect(container).toMatchSnapshot();
    });

    it('empty actions', () => {
      const { container } = render(<Actions overflowActions={actions} />);
      expect(container).toMatchSnapshot();
    });

    it('actions and overflow', () => {
      const { container } = render(<Actions actions={actions} overflowActions={actions} />);
      expect(container).toMatchSnapshot();
    });

    it('one action', () => {
      const { container } = render(<Actions actions={[actions[0]]} />);
      expect(container).toMatchSnapshot();
    });

    it('one action and multiple overflow', () => {
      const { container } = render(<Actions actions={[actions[0]]} overflowActions={actions} />);
      expect(container).toMatchSnapshot();
    });

    it('onClick takes priority from action', () => {
      const onClick = jest.fn();
      render(
        <Actions
          actions={[
            {
              label: 'some  label',
              onClick: onClick,
              props: {
                onClick: jest.fn(),
              },
            },
          ]}
        />
      );
      screen.getByText('some label').click();
      expect(onClick).toHaveBeenCalled();
    });

    it('actionObject as first action', () => {
      const { container } = render(<Actions actions={[actions[1]]} />);
      expect(container).toMatchSnapshot();
    });
  });

  describe('API', () => {
    it('should update open', () => {
      const { container } = render(<Actions actions={actions} />);
      act(() => {
        screen.getByRole('button', { expanded: false }).click();
      });
      expect(container).toMatchSnapshot();
    });

    it('should NOT call onSelect', async () => {
      const onSelect = jest.fn();
      render(<Actions actions={actions} />);
      await act(async () => {
        await screen.getByRole('button', { expanded: false }).click();
      });
      act(() => {
        screen.getByText('Some button').click();
      });
      expect(onSelect).not.toHaveBeenCalled();
    });

    it('should call onSelect', async () => {
      const onSelect = jest.fn();
      render(<Actions actions={actions} onSelect={onSelect} />);
      await act(async () => {
        await screen.getByRole('button', { expanded: false }).click();
      });
      act(() => {
        screen.getByText('Some title').click();
      });
      expect(onSelect).toHaveBeenCalled();
    });
  });
});

describe('actionPropsGenerator', () => {
  it('should consume component', () => {
    const result = actionPropsGenerator(actions[0]);
    expect(result.component).toBe('div');
  });

  it('should call correct onClick', () => {
    const onClick = jest.fn();
    const result = actionPropsGenerator({ ...actions[1], onClick });
    result.onClick({});
    expect(onClick).toHaveBeenCalled();
    expect(onClick.mock.calls[0][1].label).toBe('Some title');
  });

  it('should allow custom component in object', () => {
    const result = actionPropsGenerator({ ...actions[1], props: { component: 'span' } });
    expect(result.component).toBe('span');
  });
});

describe('overflowActionsMapper', () => {
  it('should render component', () => {
    const { container } = render(<div>{overflowActionsMapper(actions[0])}</div>);
    expect(container).toMatchSnapshot();
  });

  it('should render action object', () => {
    const { container } = render(<div>{overflowActionsMapper(actions[1])}</div>);
    expect(container).toMatchSnapshot();
  });

  it('should render plain string', () => {
    const { container } = render(<div>{overflowActionsMapper(actions[2])}</div>);
    expect(container).toMatchSnapshot();
  });
});
