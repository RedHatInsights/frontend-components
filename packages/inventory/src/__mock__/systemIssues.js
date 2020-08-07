import { systemIssuesInstance } from '../api';
import MockAdapter from 'axios-mock-adapter';

export const mock = new MockAdapter(systemIssuesInstance);
