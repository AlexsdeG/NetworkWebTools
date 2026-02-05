import { describe, it, expect, jest, beforeAll } from '@jest/globals';
import request from 'supertest';
import bcrypt from 'bcryptjs';

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

// Mock Scan Service um echte Netzwerkscans im Integration Test zu vermeiden
jest.unstable_mockModule('../../src/services/scanService.js', () => ({
  scanTarget: jest.fn().mockImplementation((target: string, ports: string) => {
    if (target === '127.0.0.1' && ports.includes('80')) {
      return Promise.resolve([{ port: 80, status: 'open', banner: 'MockService' }]);
    }
    // Simulate closed port response for other cases
    if (ports === '25560') {
      return Promise.resolve([{ port: 25560, status: 'closed', banner: '' }]);
    }
    return Promise.resolve([]);
  })
}));

import app from '../../src/app';
import jwt from 'jsonwebtoken';

describe('Scan Endpoint Integration', () => {
  let authToken: string;

  beforeAll(() => {
    // Generiere validen Token für Tests
    authToken = jwt.sign({ role: 'admin' }, MOCK_JWT_SECRET);
  });

  it('sollte 401 zurückgeben, wenn kein Token vorhanden ist', async () => {
    const res = await request(app as any).post('/api/tools/scan-ports').send({
      target: '127.0.0.1',
      ports: '80'
    });
    expect(res.statusCode).toEqual(401);
  });

  it('sollte 400 zurückgeben bei ungültiger IP', async () => {
    const res = await request(app as any)
      .post('/api/tools/scan-ports')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        target: '999.999.999.999',
        ports: '80'
      });
    
    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toBe('Validierungsfehler');
  });

  it('sollte 400 zurückgeben bei ungültigem Port-Format', async () => {
    const res = await request(app as any)
      .post('/api/tools/scan-ports')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        target: '127.0.0.1',
        ports: '80-100' // Regex erlaubt nur kommagetrennte Liste
      });
    
    expect(res.statusCode).toEqual(400);
  });

  it('sollte 200 und Ergebnisse zurückgeben bei gültiger Anfrage', async () => {
    const res = await request(app as any)
      .post('/api/tools/scan-ports')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        target: '127.0.0.1',
        ports: '80'
      });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('scanResults');
    expect(res.body.scanResults).toHaveLength(1);
    expect(res.body.scanResults[0]).toHaveProperty('port', 80);
  });
});