import { hosts, tags } from '../api';
import MockAdapter from 'axios-mock-adapter';

export const mock = new MockAdapter(hosts.axios);
export const mockTags = new MockAdapter(tags.axios);
