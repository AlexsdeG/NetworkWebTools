import { describe, it, expect, beforeAll, jest } from '@jest/globals';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Setup Mocks for Auth
const MOCK_JWT_SECRET = 'test-secret-key-must-be-long-enough';
const MOCK_HASH = bcrypt.hashSync('password', 10);

jest.mock('../../src/config/env.js', () => ({
  env: {
    PORT: 3000,
    NODE_ENV: 'test',
    JWT_SECRET: MOCK_JWT_SECRET,
    ADMIN_PASS_HASH: MOCK_HASH
  }
}));

import app from '../../src/app';

describe('IP Metadata Tool Integration', () => {
  let authToken: string;

  beforeAll(() => {
    authToken = jwt.sign({ role: 'admin' }, MOCK_JWT_SECRET);
  });

  it('sollte 401 zurückgeben ohne Token', async () => {
    const res = await request(app as any).get('/api/tools/my-ip');
    expect(res.statusCode).toBe(401);
  });

  it('sollte die IP und Geo-Daten zurückgeben (X-Forwarded-For Simulation)', async () => {
    // Google Public DNS IP - gut für Geo-Tests
    const TEST_IP = '8.8.8.8'; 

    const res = await request(app as any)
      .get('/api/tools/my-ip')
      .set('Authorization', `Bearer ${authToken}`)
      .set('X-Forwarded-For', TEST_IP);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('ip', TEST_IP);
    expect(res.body).toHaveProperty('geo');
    expect(res.body.geo).toHaveProperty('country', 'US');
  });

  it('sollte mit lokaler IP umgehen können', async () => {
    const res = await request(app as any)
      .get('/api/tools/my-ip')
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(res.statusCode).toBe(200);
    // request-ip liefert oft ::1 oder 127.0.0.1 für localhost
    expect(res.body.ip).toMatch(/(127\.0\.0\.1|::1)/);
    // Geo lookup für localhost ist null
    expect(res.body.geo).toBeNull();
  });
});