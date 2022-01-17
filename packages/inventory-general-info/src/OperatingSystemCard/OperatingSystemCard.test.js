/* eslint-disable camelcase */
import React from 'react';
import { render, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import OperatingSystemCard from './OperatingSystemCard';
import configureStore from 'redux-mock-store';
import { osTest, rhsmFacts } from '../__mock__/selectors';

describe('OperatingSystemCard', () => {
  let initialState;
  let mockStore;

  beforeEach(() => {
    mockStore = configureStore();
    initialState = {
      systemProfileStore: {
        systemProfile: {
          loaded: true,
          ...osTest,
        },
      },
      entityDetails: {
        entity: {
          facts: {
            rhsm: rhsmFacts,
          },
        },
      },
    };
  });

  it('should render correctly - no data', () => {
    const store = mockStore({ systemProfileStore: {}, entityDetails: {} });
    const wrapper = render(<OperatingSystemCard store={store} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render correctly with data', () => {
    const store = mockStore(initialState);
    const wrapper = render(<OperatingSystemCard store={store} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render enabled/disabled', () => {
    const store = mockStore({
      systemProfileStore: {
        systemProfile: {
          loaded: true,
          ...osTest,
        },
      },
      entityDetails: {
        entity: {},
      },
    });
    const wrapper = render(<OperatingSystemCard store={store} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render correctly with rhsm facts', () => {
    const store = mockStore({
      ...initialState,
      systemProfileStore: {
        systemProfile: {
          loaded: true,
        },
      },
    });
    const wrapper = render(<OperatingSystemCard store={store} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  describe('api', () => {
    it('should not render modules clickable', () => {
      const store = mockStore(initialState);
      const wrapper = mount(<OperatingSystemCard store={store} />);
      expect(wrapper.find('dd a')).toHaveLength(0);
    });

    it('should call handleClick on packages', () => {
      initialState = {
        systemProfileStore: {
          systemProfile: {
            loaded: true,
            ...osTest,
            kernel_modules: ['some-module'],
          },
        },
        entityDetails: {
          entity: {
            facts: {
              rhsm: rhsmFacts,
            },
          },
        },
      };

      const store = mockStore(initialState);
      const onClick = jest.fn();
      const wrapper = mount(<OperatingSystemCard handleClick={onClick} store={store} />);
      wrapper.find('dd a').first().simulate('click');
      expect(onClick).toHaveBeenCalled();
    });
  });

  ['hasRelease', 'hasKernelRelease', 'hasArchitecture', 'hasLastBoot', 'hasKernelModules'].map((item) =>
    it(`should not render ${item}`, () => {
      const store = mockStore(initialState);
      const wrapper = render(<OperatingSystemCard store={store} {...{ [item]: false }} />);
      expect(toJson(wrapper)).toMatchSnapshot();
    })
  );

  it('should render extra', () => {
    const store = mockStore(initialState);
    const wrapper = render(
      <OperatingSystemCard
        store={store}
        extra={[
          { title: 'something', value: 'test' },
          { title: 'with click', value: '1 tests', onClick: (_e, handleClick) => handleClick('Something', {}, 'small') },
        ]}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
