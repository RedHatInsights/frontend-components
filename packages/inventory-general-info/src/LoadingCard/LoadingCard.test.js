import React from 'react';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import LoadingCard, { Clickable } from './LoadingCard';

describe('LoadingCard', () => {
  [true, false].map((isLoading) => {
    it(`Loading card render - isLoading: ${isLoading}`, () => {
      const wrapper = shallow(<LoadingCard isLoading={isLoading} title={`Card that is ${isLoading ? 'loading' : 'loaded'}`} />);
      expect(toJson(wrapper)).toMatchSnapshot();
    });
  });

  it('should render loading bars', () => {
    const wrapper = shallow(
      <LoadingCard
        isLoading={true}
        title="Some title"
        items={[
          {
            onClick: jest.fn(),
            title: 'test-title',
            size: 'md',
            value: 'some value',
          },
          {
            title: 'just title',
          },
        ]}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it(`Loading card render`, () => {
    const wrapper = shallow(
      <LoadingCard
        isLoading={false}
        title="Some title"
        items={[
          {
            onClick: jest.fn(),
            title: 'test-title',
            size: 'md',
            value: 'some value',
          },
          {
            title: 'just title',
          },
        ]}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('Clickable should render - no data', () => {
    const wrapper = shallow(<Clickable />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  describe('none/not available', () => {
    it(`should not be clickable when the value is 0`, () => {
      const wrapper = mount(
        <LoadingCard
          isLoading={false}
          title="Some title"
          items={[
            {
              onClick: jest.fn(),
              title: 'test-title',
              value: 0,
            },
          ]}
        />
      );

      expect(wrapper.find('dd').text()).toEqual('None');
      expect(wrapper.find(Clickable)).toHaveLength(0);
    });

    it(`should not be clickable when the value is 0 with plural`, () => {
      const wrapper = mount(
        <LoadingCard
          isLoading={false}
          title="Some title"
          items={[
            {
              onClick: jest.fn(),
              title: 'test-title',
              value: 0,
              singular: 'system',
            },
          ]}
        />
      );

      expect(wrapper.find('dd').text()).toEqual('0 systems');
      expect(wrapper.find(Clickable)).toHaveLength(0);
    });

    it(`should not be clickable when the value is undefined`, () => {
      const wrapper = mount(
        <LoadingCard
          isLoading={false}
          title="Some title"
          items={[
            {
              onClick: jest.fn(),
              title: 'test-title',
              value: undefined,
            },
          ]}
        />
      );

      expect(wrapper.find('dd').text()).toEqual('Not available');
      expect(wrapper.find(Clickable)).toHaveLength(0);
    });

    it(`should be none when value is 0`, () => {
      const wrapper = mount(
        <LoadingCard
          isLoading={false}
          title="Some title"
          items={[
            {
              title: 'test-title',
              value: 0,
            },
          ]}
        />
      );

      expect(wrapper.find('dd').text()).toEqual('None');
      expect(wrapper.find(Clickable)).toHaveLength(0);
    });

    it(`should be not available when value is undefined`, () => {
      const wrapper = mount(
        <LoadingCard
          isLoading={false}
          title="Some title"
          items={[
            {
              title: 'test-title',
              value: undefined,
            },
          ]}
        />
      );

      expect(wrapper.find('dd').text()).toEqual('Not available');
      expect(wrapper.find(Clickable)).toHaveLength(0);
    });

    it(`plurazied none`, () => {
      const wrapper = mount(
        <LoadingCard
          isLoading={false}
          title="Some title"
          items={[
            {
              title: 'test-title',
              value: 0,
              singular: 'system',
            },
          ]}
        />
      );

      expect(wrapper.find('dd').text()).toEqual('0 systems');
      expect(wrapper.find(Clickable)).toHaveLength(0);
    });

    it(`should be clickable with plural`, () => {
      const wrapper = mount(
        <LoadingCard
          isLoading={false}
          title="Some title"
          items={[
            {
              onClick: jest.fn(),
              title: 'test-title',
              value: 23,
              singular: 'system',
            },
          ]}
        />
      );

      expect(wrapper.find('dd').text()).toEqual('23 systems');
      expect(wrapper.find(Clickable).find('a')).toHaveLength(1);
    });

    it(`should be clickable with custom plural`, () => {
      const wrapper = mount(
        <LoadingCard
          isLoading={false}
          title="Some title"
          items={[
            {
              onClick: jest.fn(),
              title: 'test-title',
              value: 23,
              singular: 'process',
              plural: 'processes',
            },
          ]}
        />
      );

      expect(wrapper.find('dd').text()).toEqual('23 processes');
      expect(wrapper.find(Clickable).find('a')).toHaveLength(1);
    });
  });

  it('Clickable should render', () => {
    const onClick = jest.fn();
    const wrapper = shallow(
      <Clickable
        item={{
          onClick,
          value: 15,
          target: 'some-target',
        }}
      />
    );
    wrapper
      .find('a')
      .first()
      .simulate('click', {
        preventDefault: () => {},
      });
    expect(onClick).toHaveBeenCalled();
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('Clickable should render - 0 value', () => {
    const onClick = jest.fn();
    const wrapper = shallow(
      <Clickable
        item={{
          onClick,
          value: 0,
          target: 'some-target',
        }}
      />
    );
    expect(onClick).not.toHaveBeenCalled();
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
