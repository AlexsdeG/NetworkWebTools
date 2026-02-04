import { describe, it, expect, beforeAll, jest } from '@jest/globals';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Mock Config
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

// Mock Scan Service um Zeit zu sparen (wir testen nur das Limit, nicht den Scan)
jest.unstable_mockModule('../../src/services/scanService.js', () => ({
  scanTarget: jest.fn().mockResolvedValue([] as any)
}));

import app from '../../src/app';

describe('Rate Limiting Integration', () => {
  let authToken: string;

  beforeAll(() => {
    authToken = jwt.sign({ role: 'admin' }, MOCK_JWT_SECRET);
  });

  it('sollte maximal 5 Scan-Anfragen pro Minute erlauben', async () => {
    // Wir simulieren 5 erlaubte Anfragen
    // Da supertest/jest parallel laufen könnten, ist es sicherer, einen kurzen Loop zu machen
    
    const endpoint = '/api/tools/scan-ports';
    const payload = { target: '127.0.0.1', ports: '80' };

    // Setze Counter zurück oder verlasse dich darauf, dass dies der erste Testlauf ist.
    // In einer echten Umgebung speichert express-rate-limit State im Speicher.
    
    for (let i = 0; i < 5; i++) {
      const res = await request(app as any)
        .post(endpoint)
        .set('Authorization', `Bearer ${authToken}`)
        .send(payload);
      
      // Entweder 200 (OK) oder 400/500 (falls Mock/Validierung greift), aber NICHT 429
      expect(res.statusCode).not.toBe(429);
    }

    // Die 6. Anfrage sollte blockiert werden
    const res = await request(app as any)
      .post(endpoint)
      .set('Authorization', `Bearer ${authToken}`)
      .send(payload);

    expect(res.statusCode).toBe(429);
    expect(res.body.error).toContain('Scan-Limit erreicht');
  });

  it('sollte normale API-Aufrufe durchlassen (unter dem globalen Limit)', async () => {
    const res = await request(app as any)
      .get('/api/tools/my-ip')
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(res.statusCode).not.toBe(429);
  });
});