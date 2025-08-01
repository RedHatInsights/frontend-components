import cookieTransform, { Entitlement } from './cookieTransform';
import type { Request as ExpressRequest, Response } from 'express';
import type * as http from 'http';

// Mock jws module
jest.mock('jws', () => ({
  decode: jest.fn()
}));

import jws from 'jws';
const mockJws = jws as jest.Mocked<typeof jws>;

describe('cookieTransform', () => {
  let mockProxyReq: jest.Mocked<http.ClientRequest>;
  let mockReq: Partial<ExpressRequest>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockProxyReq = {
      setHeader: jest.fn()
    } as any;

    mockReq = {
      headers: {}
    };

    mockRes = {} as Response;
  });

  it('should transform cookie with default entitlements', () => {
    const mockPayload = {
      account_number: '12345',
      org_id: '67890',
      username: 'testuser',
      email: 'test@example.com',
      first_name: 'Test',
      last_name: 'User',
      is_org_admin: false,
      is_internal: false,
      account_id: '54321',
      auth_time: 1234567890
    };

    mockReq.headers = {
      cookie: 'cs_jwt=mockjwttoken'
    };

    mockJws.decode.mockReturnValue({
      payload: mockPayload
    } as any);

    cookieTransform(mockProxyReq, mockReq as ExpressRequest, mockRes as Response, {
      user: {},
      internal: {},
      identity: {}
    });

    expect(mockJws.decode).toHaveBeenCalledWith('mockjwttoken');
    expect(mockProxyReq.setHeader).toHaveBeenCalledWith(
      'x-rh-identity',
      expect.any(String)
    );

    // Verify the header contains expected structure
    const headerCall = mockProxyReq.setHeader.mock.calls[0];
    const identityB64 = headerCall[1] as string;
    const identity = JSON.parse(Buffer.from(identityB64, 'base64').toString('utf8'));

    expect(identity).toMatchObject({
      entitlements: {
        insights: { is_entitled: true },
        smart_management: { is_entitled: true },
        openshift: { is_entitled: true },
        hybrid: { is_entitled: true },
        migrations: { is_entitled: true },
        ansible: { is_entitled: true },
        cost_management: { is_entitled: true }
      },
      identity: {
        type: 'User',
        auth_type: 'basic-auth',
        account_number: '12345',
        org_id: '67890',
        user: {
          username: 'testuser',
          email: 'test@example.com',
          first_name: 'Test',
          last_name: 'User',
          is_active: true,
          is_org_admin: false,
          is_internal: false,
          locale: 'en-US',
          user_id: '54321'
        },
        internal: {
          org_id: '67890',
          auth_time: 1234567890
        }
      }
    });
  });

  it('should handle authorization header instead of cookie', () => {
    const mockPayload = {
      account_number: '12345',
      org_id: '67890',
      username: 'testuser',
      email: 'test@example.com',
      first_name: 'Test',
      last_name: 'User',
      is_org_admin: false,
      is_internal: false,
      account_id: '54321',
      auth_time: 1234567890
    };

    mockReq.headers = {
      authorization: 'Bearer mockjwttoken'
    };

    mockJws.decode.mockReturnValue({
      payload: mockPayload
    } as any);

    cookieTransform(mockProxyReq, mockReq as ExpressRequest, mockRes as Response, {
      user: {},
      internal: {},
      identity: {}
    });

    expect(mockJws.decode).toHaveBeenCalledWith('mockjwttoken');
    expect(mockProxyReq.setHeader).toHaveBeenCalled();
  });

  it('should use custom entitlements when provided', () => {
    const customEntitlements: { [sku: string]: Entitlement } = {
      'custom-service': { is_entitled: true, is_trial: true }
    };

    const mockPayload = {
      account_number: '12345',
      org_id: '67890',
      username: 'testuser',
      email: 'test@example.com',
      first_name: 'Test',
      last_name: 'User',
      is_org_admin: false,
      is_internal: false,
      account_id: '54321',
      auth_time: 1234567890
    };

    mockReq.headers = {
      cookie: 'cs_jwt=mockjwttoken'
    };

    mockJws.decode.mockReturnValue({
      payload: mockPayload
    } as any);

    cookieTransform(mockProxyReq, mockReq as ExpressRequest, mockRes as Response, {
      entitlements: customEntitlements,
      user: {},
      internal: {},
      identity: {}
    });

    const headerCall = mockProxyReq.setHeader.mock.calls[0];
    const identityB64 = headerCall[1] as string;
    const identity = JSON.parse(Buffer.from(identityB64, 'base64').toString('utf8'));

    expect(identity.entitlements).toEqual(customEntitlements);
  });

  it('should merge custom user data', () => {
    const mockPayload = {
      account_number: '12345',
      org_id: '67890',
      username: 'testuser',
      email: 'test@example.com',
      first_name: 'Test',
      last_name: 'User',
      is_org_admin: false,
      is_internal: false,
      account_id: '54321',
      auth_time: 1234567890
    };

    mockReq.headers = {
      cookie: 'cs_jwt=mockjwttoken'
    };

    mockJws.decode.mockReturnValue({
      payload: mockPayload
    } as any);

    cookieTransform(mockProxyReq, mockReq as ExpressRequest, mockRes as Response, {
      user: { custom_field: 'custom_value' },
      internal: { custom_internal: 'internal_value' },
      identity: { custom_identity: 'identity_value' }
    });

    const headerCall = mockProxyReq.setHeader.mock.calls[0];
    const identityB64 = headerCall[1] as string;
    const identity = JSON.parse(Buffer.from(identityB64, 'base64').toString('utf8'));

    expect(identity.identity.user.custom_field).toBe('custom_value');
    expect(identity.identity.internal.custom_internal).toBe('internal_value');
    expect(identity.identity.custom_identity).toBe('identity_value');
  });

  it('should do nothing when no cookie or authorization header', () => {
    mockReq.headers = {};

    cookieTransform(mockProxyReq, mockReq as ExpressRequest, mockRes as Response, {
      user: {},
      internal: {},
      identity: {}
    });

    expect(mockJws.decode).not.toHaveBeenCalled();
    expect(mockProxyReq.setHeader).not.toHaveBeenCalled();
  });

  it('should do nothing when JWT decode fails', () => {
    mockReq.headers = {
      cookie: 'cs_jwt=invalidtoken'
    };

    mockJws.decode.mockReturnValue(null);

    cookieTransform(mockProxyReq, mockReq as ExpressRequest, mockRes as Response, {
      user: {},
      internal: {},
      identity: {}
    });

    expect(mockJws.decode).toHaveBeenCalledWith('invalidtoken');
    expect(mockProxyReq.setHeader).not.toHaveBeenCalled();
  });

  it('should handle cookie with multiple values', () => {
    const mockPayload = {
      account_number: '12345',
      org_id: '67890',
      username: 'testuser',
      email: 'test@example.com',
      first_name: 'Test',
      last_name: 'User',
      is_org_admin: false,
      is_internal: false,
      account_id: '54321',
      auth_time: 1234567890
    };

    mockReq.headers = {
      cookie: 'other=value; cs_jwt=mockjwttoken; another=value'
    };

    mockJws.decode.mockReturnValue({
      payload: mockPayload
    } as any);

    cookieTransform(mockProxyReq, mockReq as ExpressRequest, mockRes as Response, {
      user: {},
      internal: {},
      identity: {}
    });

    expect(mockJws.decode).toHaveBeenCalledWith('mockjwttoken');
    expect(mockProxyReq.setHeader).toHaveBeenCalled();
  });

  // Test documented functionality from our documentation  
  it('should match documentation behavior', () => {
    // This validates our documentation is accurate
    const mockPayload = {
      account_number: '12345',
      org_id: '67890',
      username: 'testuser',
      email: 'test@example.com',
      first_name: 'Test',
      last_name: 'User',
      is_org_admin: false,
      is_internal: false,
      account_id: '54321',
      auth_time: 1234567890
    };

    mockReq.headers = {
      cookie: 'cs_jwt=mocktoken'
    };

    mockJws.decode.mockReturnValue({
      payload: mockPayload
    } as any);

    // Test example from documentation
    cookieTransform(mockProxyReq, mockReq as ExpressRequest, mockRes as Response, {
      user: { username: 'testuser' },
      internal: { org_id: '123' },
      identity: { custom: 'data' }
    });

    // Verify x-rh-identity header is set
    expect(mockProxyReq.setHeader).toHaveBeenCalledWith(
      'x-rh-identity',
      expect.any(String)
    );

    // Verify structure matches documentation
    const headerCall = mockProxyReq.setHeader.mock.calls[0];
    const identityB64 = headerCall[1] as string;
    const identity = JSON.parse(Buffer.from(identityB64, 'base64').toString('utf8'));

    expect(identity).toHaveProperty('entitlements');
    expect(identity).toHaveProperty('identity');
    expect(identity.identity).toHaveProperty('user');
    expect(identity.identity).toHaveProperty('internal');
    expect(identity.identity.custom).toBe('data');
  });
});
