import { describe, it, expect } from '@jest/globals';
import request from 'supertest';
import app from '../src/app';

describe('System Health Check', () => {
  it('GET /health sollte Status 200 und eine Erfolgsmeldung zurückgeben', async () => {
    // Cast app to any to avoid strict type mismatch between express.Application and supertest input
    const res = await request(app as any).get('/health');
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('message', 'System läuft stabil');
    expect(res.body).toHaveProperty('timestamp');
  });
});