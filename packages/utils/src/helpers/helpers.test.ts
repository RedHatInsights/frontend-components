import { downloadFile, generateFilter, getBaseName, mergeArraysByKey, processDate } from './helpers';

describe('mergeArraysByKey', () => {
  it('should join two arrays by ID', () => {
    const result = mergeArraysByKey([
      [
        {
          id: '1',
          value: '5',
        },
        {
          id: '2',
          value: '9',
        },
      ],
      [
        {
          id: '1',
          value: '7',
        },
      ],
    ]);
    expect(result.length).toBe(2);
    expect(result).toEqual(expect.arrayContaining([expect.objectContaining({ id: '1', value: '7' })]));
  });

  it('should join arryas by different key', () => {
    const result = mergeArraysByKey(
      [
        [
          {
            key: '1',
            value: '5',
          },
          {
            key: '2',
            value: '9',
          },
          {
            id: '5',
            value: '4',
          },
        ],
        [
          {
            key: '1',
            value: '7',
          },
        ],
      ],
      'key'
    );
    expect(result.length).toBe(3);
    expect(result).toEqual(expect.arrayContaining([expect.objectContaining({ key: '1', value: '7' })]));
  });
});

describe('downloadFile', () => {
  const createObjectURL = jest.fn();
  const Blob = jest.fn();
  // Create object signature will not match the original interface because its a jest mock function
  // @ts-ignore
  global.URL = {
    ...global.URL,
    createObjectURL,
  };
  global.Blob = Blob;
  it('should call correct functions - CSV', () => {
    downloadFile({ f: 'f' });
    expect(Blob).toHaveBeenLastCalledWith([{ f: 'f' }], { type: 'text/csv;charset=utf-8;' });
    expect(createObjectURL).toHaveBeenCalled();
  });

  it('should call correct functions - JSON', () => {
    downloadFile({ f: 'f' }, 'filename', 'json');
    expect(Blob).toHaveBeenLastCalledWith([{ f: 'f' }], { type: 'data:text/json;charset=utf-8,' });
    expect(createObjectURL).toHaveBeenCalled();
  });
});

describe('processDate', () => {
  it('should return parsed date', () => {
    expect(processDate(1558530000000)).toBe('22 May 2019');
  });

  it('should return N/A for wrong date', () => {
    expect(processDate('')).toBe('N/A');
  });

  it('should render parse date correctly', () => {
    expect(processDate(1557000000000)).toBe('04 May 2019');
  });
});

describe('getBaseName', () => {
  [
    ['/group/application', '/group/application'],
    ['/group/application/navigation', '/group/application'],
    ['/group', '/group/'],
    ['/beta/group/application', '/beta/group/application'],
    ['/beta/group', '/beta/group/'],
    ['/preview/group', '/preview/group/'],
    ['/preview/group/application', '/preview/group/application'],
    ['/group/application#id', '/group/application'],
    ['/group/application?param=value', '/group/application'],
  ].map(([pathName, baseName]) =>
    it(`should return ${baseName} for ${pathName}`, () => {
      expect(getBaseName(pathName)).toBe(baseName);
    })
  );

  it('should work with long url', () => {
    expect(getBaseName('/really/long/url/with/some/stuff')).toBe('/really/long');
  });

  it('should work with custom level', () => {
    expect(getBaseName('/really/long/url/with/some/stuff', 5)).toBe('/really/long/url/with/some');
  });

  it('should work with 1st level', () => {
    expect(getBaseName('/really/long/url/with/some/stuff', 1)).toBe('/really');
  });

  it('should work with root level', () => {
    expect(getBaseName('/really/long/url/with/some/stuff', 0)).toBe('/');
  });
});

describe('generateFilter', () => {
  it('should generate filter for array', () => {
    const result = generateFilter({
      some: [1, 2],
    });
    expect(result).toMatchObject({
      'filter[some][]': [1, 2],
    });
  });

  it('should generate filter for array with enhancer', () => {
    const result = generateFilter(
      {
        some: [1, 2],
      },
      undefined,
      { arrayEnhancer: 'contains' }
    );
    expect(result).toMatchObject({
      'filter[some][contains][]': [1, 2],
    });
  });

  it('should generate nested filter', () => {
    const result = generateFilter({
      some: {
        key: {
          obj: {
            nested: {
              really: {
                long: 'value',
              },
            },
          },
        },
      },
    });
    expect(result).toMatchObject({
      'filter[some][key][obj][nested][really][long]': 'value',
    });
  });

  it('should ignore Dates and Functions', () => {
    const result = generateFilter({
      some: () => '',
      value: new Date(),
      actual: {
        value: 'value',
      },
    });
    expect(result).toMatchObject({
      'filter[actual][value]': 'value',
    });
  });

  it('should allow custom prefix', () => {
    const result = generateFilter(
      {
        actual: {
          value: 'value',
        },
      },
      ''
    );
    expect(result).toMatchObject({
      '[actual][value]': 'value',
    });
  });
});
