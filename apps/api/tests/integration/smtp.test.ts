import { describe, it, expect, jest, beforeAll } from '@jest/globals';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Mocks Setup
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

// Mock SMTP Service
jest.unstable_mockModule('../../src/services/smtpService.js', () => ({
  verifyConnection: jest.fn().mockImplementation((config: any) => {
    if (config.host === 'valid.smtp.com') {
      return Promise.resolve({ success: true, message: 'Verbunden' });
    }
    return Promise.resolve({ success: false, message: 'Fehler', details: 'Mock Error' });
  })
}));

import app from '../../src/app';

describe('SMTP Endpoint Integration', () => {
  let authToken: string;

  beforeAll(() => {
    authToken = jwt.sign({ role: 'admin' }, MOCK_JWT_SECRET);
  });

  it('sollte 401 zurückgeben ohne Token', async () => {
    const res = await request(app as any).post('/api/tools/test-smtp').send({});
    expect(res.statusCode).toBe(401);
  });

  it('sollte 400 zurückgeben bei fehlenden Daten', async () => {
    const res = await request(app as any)
      .post('/api/tools/test-smtp')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ host: 'just-host' }); // Port fehlt
    
    expect(res.statusCode).toBe(400);
  });

  it('sollte 200 bei erfolgreicher Verbindung zurückgeben', async () => {
    const res = await request(app as any)
      .post('/api/tools/test-smtp')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        host: 'valid.smtp.com',
        port: 587,
        secure: false
      });
    
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('sollte 422 bei fehlgeschlagener Verbindung zurückgeben', async () => {
    const res = await request(app as any)
      .post('/api/tools/test-smtp')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        host: 'invalid.smtp.com',
        port: 587,
        secure: false
      });
    
    expect(res.statusCode).toBe(422);
    expect(res.body.success).toBe(false);
  });
});