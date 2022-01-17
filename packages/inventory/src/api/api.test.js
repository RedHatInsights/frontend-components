/* eslint-disable camelcase */
/* eslint-disable max-len */
import { mockTags } from '../__mock__/hostApi';
import { getAllTags, filtersReducer, constructTags, mapData } from './api';

describe('filtersReducer', () => {
  it('should update original object', () => {
    expect(filtersReducer({ something: 'test' })).toMatchObject({ something: 'test' });
  });

  it('should generate hostnameOrId', () => {
    expect(
      filtersReducer(
        {},
        {
          value: 'hostname_or_id',
          filter: 'something',
        }
      )
    ).toMatchObject({ hostnameOrId: 'something' });
  });

  it('should generate tagFilters', () => {
    expect(
      filtersReducer(
        {},
        {
          tagFilters: 'something',
        }
      )
    ).toMatchObject({ tagFilters: 'something' });
  });

  it('should generate staleFilter', () => {
    expect(
      filtersReducer(
        {},
        {
          staleFilter: 'something',
        }
      )
    ).toMatchObject({ staleFilter: 'something' });
  });

  it('should generate registeredWithFilter', () => {
    expect(
      filtersReducer(
        {},
        {
          registeredWithFilter: 'something',
        }
      )
    ).toMatchObject({ registeredWithFilter: 'something' });
  });
});

describe('constructTags', () => {
  it('should map tags', () => {
    expect(
      constructTags([
        {
          values: [
            {
              value: 'some value',
              tagKey: 'some key',
            },
          ],
          category: 'namespace',
        },
        {
          values: [
            {
              value: '',
              tagKey: 'some key',
            },
          ],
          category: '',
        },
      ])
    ).toMatchObject(['namespace/some key=some value', 'some key']);
  });
});

describe('mapData', () => {
  it('should reduce facts', () => {
    expect(
      mapData({
        facts: [
          {
            namespace: 'something',
            facts: 'test',
          },
        ],
      })
    ).toMatchObject({
      facts: {
        something: 'test',
      },
    });
  });

  it('should flatten facts', () => {
    expect(
      mapData({
        facts: [
          {
            namespace: 'something',
            facts: {
              another: 'test',
            },
          },
        ],
      })
    ).toMatchObject({
      facts: {
        another: 'test',
      },
    });
  });

  describe('os_release', () => {
    it('should use os_release', () => {
      expect(
        mapData({
          facts: [
            {
              namespace: 'something',
              facts: {
                os_release: 'test',
              },
            },
          ],
        })
      ).toMatchObject({
        facts: {
          os_release: 'test',
        },
      });
    });

    it('should use release', () => {
      expect(
        mapData({
          facts: [
            {
              namespace: 'something',
              facts: {
                release: 'test',
              },
            },
          ],
        })
      ).toMatchObject({
        facts: {
          os_release: 'test',
        },
      });
    });
  });

  describe('display_name', () => {
    it('should use display_name', () => {
      expect(
        mapData({
          facts: [
            {
              namespace: 'something',
              facts: {
                display_name: 'test',
              },
            },
          ],
        })
      ).toMatchObject({
        facts: {
          display_name: 'test',
        },
      });
    });

    it('should use fqdn', () => {
      expect(
        mapData({
          facts: [
            {
              namespace: 'something',
              facts: {
                fqdn: 'test',
              },
            },
          ],
        })
      ).toMatchObject({
        facts: {
          display_name: 'test',
        },
      });
    });

    it('should use id', () => {
      expect(
        mapData({
          facts: [
            {
              namespace: 'something',
              facts: {
                id: 'test',
              },
            },
          ],
        })
      ).toMatchObject({
        facts: {
          display_name: 'test',
        },
      });
    });
  });
});

describe('getAllTags', () => {
  it('should generate get all tags call', async () => {
    mockTags
      .onGet('/api/inventory/v1/tags?order_by=tag&order_how=ASC&per_page=10&page=1&staleness=fresh&staleness=stale&registered_with=insights')
      .replyOnce(200, { test: 'test' });
    const data = await getAllTags();
    expect(data).toMatchObject({ test: 'test' });
  });

  it('should generate get all tags call with search', async () => {
    mockTags
      .onGet(
        '/api/inventory/v1/tags?order_by=tag&order_how=ASC&per_page=10&page=1&staleness=fresh&staleness=stale&search=something&registered_with=insights'
      )
      .replyOnce(200, { test: 'test' });
    const data = await getAllTags('something');
    expect(data).toMatchObject({ test: 'test' });
  });

  describe('tagFilters', () => {
    it('should generate get all tags call with tagFilters', async () => {
      mockTags
        .onGet(
          '/api/inventory/v1/tags?tags=namespace%2Fsome%20key%3Dsome%20value&tags=some%20key&order_by=tag&order_how=ASC&per_page=10&page=1&staleness=fresh&staleness=stale&registered_with=insights'
        )
        .replyOnce(200, { test: 'test' });
      const data = await getAllTags(undefined, {
        filters: [
          {
            tagFilters: [
              {
                values: [
                  {
                    value: 'some value',
                    tagKey: 'some key',
                  },
                ],
                category: 'namespace',
              },
              {
                values: [
                  {
                    value: '',
                    tagKey: 'some key',
                  },
                ],
                category: '',
              },
            ],
          },
        ],
      });
      expect(data).toMatchObject({ test: 'test' });
    });

    it('should generate get all tags call with staleFilter', async () => {
      mockTags
        .onGet('/api/inventory/v1/tags?order_by=tag&order_how=ASC&per_page=10&page=1&staleness=something&registered_with=insights')
        .replyOnce(200, { test: 'test' });
      const data = await getAllTags(undefined, {
        filters: [
          {
            staleFilter: ['something'],
          },
        ],
      });
      expect(data).toMatchObject({ test: 'test' });
    });

    it('should generate get all tags call with registeredWithFilter', async () => {
      mockTags
        .onGet('/api/inventory/v1/tags?order_by=tag&order_how=ASC&per_page=10&page=1&staleness=fresh&staleness=stale&registered_with=something')
        .replyOnce(200, { test: 'test' });
      const data = await getAllTags(undefined, {
        filters: [
          {
            registeredWithFilter: ['something'],
          },
        ],
      });
      expect(data).toMatchObject({ test: 'test' });
    });
  });

  describe('pagination', () => {
    it('should generate get all tags call with perPage', async () => {
      mockTags
        .onGet('/api/inventory/v1/tags?order_by=tag&order_how=ASC&per_page=50&page=1&staleness=fresh&staleness=stale&registered_with=insights')
        .replyOnce(200, { test: 'test' });
      const data = await getAllTags(undefined, {
        pagination: {
          perPage: 50,
        },
      });
      expect(data).toMatchObject({ test: 'test' });
    });

    it('should generate get all tags call with page', async () => {
      mockTags
        .onGet('/api/inventory/v1/tags?order_by=tag&order_how=ASC&per_page=10&page=20&staleness=fresh&staleness=stale&registered_with=insights')
        .replyOnce(200, { test: 'test' });
      const data = await getAllTags(undefined, {
        pagination: {
          page: 20,
        },
      });
      expect(data).toMatchObject({ test: 'test' });
    });
  });
});
