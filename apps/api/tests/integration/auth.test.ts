import { describe, it, expect, beforeAll, jest } from '@jest/globals';
import request from 'supertest';
import bcrypt from 'bcryptjs';

// Setup Mock Environment variables BEFORE importing app
// Dies simuliert die .env Datei und verhindert, dass env.ts abstürzt
const MOCK_PASSWORD = 'superSecretPassword123';
const MOCK_HASH = bcrypt.hashSync(MOCK_PASSWORD, 10);
const MOCK_JWT_SECRET = 'test-secret-key-must-be-long-enough';

jest.mock('../src/config/env.js', () => ({
  env: {
    PORT: 3000,
    NODE_ENV: 'test',
    JWT_SECRET: MOCK_JWT_SECRET,
    ADMIN_PASS_HASH: MOCK_HASH
  }
}));

// Import App after mocking env
import app from '../src/app';

describe('Authentication System', () => {
  let authToken: string;

  describe('POST /api/auth/login', () => {
    it('sollte bei fehlendem Passwort 400 zurückgeben', async () => {
      const res = await request(app).post('/api/auth/login').send({});
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error');
    });

    it('sollte bei falschem Passwort 401 zurückgeben', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ password: 'wrongPassword' });
      
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('error', 'Ungültiges Passwort');
    });

    it('sollte bei korrektem Passwort ein JWT Token zurückgeben', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ password: MOCK_PASSWORD });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
      
      // Speichern für nachfolgende Tests
      authToken = res.body.token;
    });
  });

  describe('Protected Routes & Middleware', () => {
    it('sollte Zugriff ohne Token verweigern (401)', async () => {
      const res = await request(app).get('/api/auth/verify');
      expect(res.statusCode).toEqual(401);
    });

    it('sollte Zugriff mit ungültigem Token verweigern (403)', async () => {
      const res = await request(app)
        .get('/api/auth/verify')
        .set('Authorization', 'Bearer invalid-token-string');
      expect(res.statusCode).toEqual(403);
    });

    it('sollte Zugriff mit gültigem Token erlauben (200)', async () => {
      const res = await request(app)
        .get('/api/auth/verify')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('status', 'valid');
      expect(res.body.user).toHaveProperty('role', 'admin');
    });
  });
});