import React from 'react';
import { constructGroups, constructValues, mapGroups } from './constants';
import { render } from '@testing-library/react';

describe('mapGroups', () => {
  it('should build correctly empty', () => {
    const result = mapGroups({
      namespace: {
        something: {
          isSelected: false,
          item: {
            meta: {
              tag: {
                key: 'someKey',
                value: 'someValue',
              },
            },
          },
        },
      },
    });
    expect(result.length).toBe(0);
    expect(result).toMatchObject([]);
  });

  it('should build correctly', () => {
    const result = mapGroups({
      namespace: {
        something: {
          isSelected: true,
          item: {
            meta: {
              tag: {
                key: 'someKey',
                value: 'someValue',
              },
            },
          },
        },
      },
    });
    expect(result[0]).toMatchObject({
      type: 'tags',
      key: 'namespace',
      category: 'namespace',
    });
    expect(result[0].values[0]).toMatchObject({
      key: 'something',
      tagKey: 'someKey',
      value: 'someValue',
      name: 'someKey=someValue',
      group: { value: 'namespace' },
    });
  });

  it("should use group's label", () => {
    const result = mapGroups({
      namespace: {
        something: {
          isSelected: true,
          group: {
            label: 'someLabel',
            value: undefined,
          },
          item: {
            meta: {
              tag: {
                key: 'someKey',
                value: 'someValue',
              },
            },
          },
        },
      },
    });
    expect(result[0]).toMatchObject({
      category: 'someLabel',
    });
  });

  it('should build correctly - no value', () => {
    const result = mapGroups(undefined, 'something');
    expect(result.length).toBe(0);
    expect(result).toMatchObject([]);
  });
});

describe('constructValues', () => {
  it('should build correctly - with meta', () => {
    const result = constructValues(
      {
        something: {
          isSelected: true,
          item: {
            meta: {
              tag: {
                key: 'namespace',
                value: 'someValue',
              },
            },
          },
        },
      },
      'namespace',
    );
    expect(result).toMatchObject([
      {
        key: 'something',
        tagKey: 'namespace',
        value: 'someValue',
        name: 'namespace=someValue',
        group: { value: 'namespace' },
      },
    ]);
  });

  it('should build correctly - without meta', () => {
    const result = constructValues(
      {
        something: {
          isSelected: true,
          item: {
            tagKey: 'namespace',
            tagValue: 'someValue',
          },
        },
      },
      'namespace',
    );
    expect(result).toMatchObject([
      {
        key: 'something',
        tagKey: 'namespace',
        value: 'someValue',
        name: 'namespace=someValue',
        group: { value: 'namespace' },
      },
    ]);
  });

  it('should build correctly - with value', () => {
    const result = constructValues(
      {
        something: {
          isSelected: true,
          value: 'someValue',
        },
      },
      'namespace',
    );
    expect(result).toMatchObject([
      {
        key: 'something',
        tagKey: 'namespace',
        value: 'someValue',
        name: 'namespace=someValue',
        group: { value: 'namespace' },
      },
    ]);
  });

  it('should build correctly - no meta', () => {
    const result = constructValues(
      {
        something: {
          isSelected: true,
          item: {
            tagValue: 'someValue',
          },
        },
      },
      'namespace',
    );
    expect(result).toMatchObject([
      {
        key: 'something',
        tagKey: 'namespace',
        value: 'someValue',
        name: 'namespace=someValue',
        group: { value: 'namespace' },
      },
    ]);
  });

  it('should build correctly - not selected', () => {
    const result = constructValues(
      {
        something: {
          isSelected: false,
          item: {
            tagValue: 'someValue',
          },
        },
      },
      'namespace',
    );
    expect(result.length).toBe(0);
    expect(result).toMatchObject([]);
  });

  it('should build correctly - no value', () => {
    const result = constructValues(undefined, 'something');
    expect(result.length).toBe(0);
    expect(result).toMatchObject([]);
  });
});

describe('constructGroups', () => {
  const tags = [
    {
      name: 'someName',
      tags: [
        {
          count: 1,
          tag: {
            key: 'someKey',
            value: 'someValue',
          },
        },
      ],
    },
  ];
  it('should build filter groups', () => {
    const result = constructGroups(tags);
    expect(result[0]).toMatchObject({
      type: 'checkbox',
      label: 'someName',
      value: 'someName',
    });
  });

  it('should build filter groups - with radio type', () => {
    const result = constructGroups([
      ...tags,
      {
        name: 'someName',
        type: 'radio',
        tags: [
          {
            count: 1,
            tag: {
              key: 'someKey',
              value: 'someValue',
            },
          },
        ],
      },
    ]);
    expect(result[1]).toMatchObject({
      type: 'radio',
      label: 'someName',
      value: 'someName',
    });
  });

  it('should build filter with empty badge', () => {
    const result = constructGroups([
      ...tags,
      {
        name: 'someName',
        type: 'radio',
        tags: [
          {
            count: 0,
            tag: {
              key: 'someKey',
              value: 'someValue',
            },
          },
        ],
      },
    ]);
    const Cmp = () => result[1].items[0].label;
    const { container } = render(<Cmp />);
    expect(container).toMatchSnapshot();
  });

  it('should render correctly', () => {
    const result = constructGroups(tags);
    const Cmp = () => result[0].items[0].label;
    const { container } = render(<Cmp />);
    expect(container).toMatchSnapshot();
  });

  it('should create correct meta info', () => {
    const result = constructGroups(tags);
    expect(result[0].items[0].meta).toMatchObject({
      count: 1,
      tag: {
        key: 'someKey',
        value: 'someValue',
      },
    });
    expect(result[0].items[0].value).toBe('someKey=someValue');
    expect(result[0].items[0].tagValue).toBe('someValue');
  });
});
