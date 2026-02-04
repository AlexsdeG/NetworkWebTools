import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import nodemailer from 'nodemailer';

// Mock Nodemailer
jest.mock('nodemailer');

// Import Service AFTER mocking
import * as smtpService from '../../src/services/smtpService';

describe('SMTP Service Unit Test', () => {
  // Fix: Type the mock function to allow returning Promises
  const mockVerify = jest.fn<() => Promise<boolean>>();
  const mockCreateTransport = nodemailer.createTransport as jest.Mock;

  beforeEach(() => {
    mockVerify.mockReset();
    mockCreateTransport.mockReturnValue({
      verify: mockVerify
    });
  });

  it('sollte Erfolg zurückgeben, wenn verify() resolved', async () => {
    mockVerify.mockResolvedValue(true);

    const config = {
      host: 'smtp.example.com',
      port: 587,
      user: 'user',
      pass: 'pass',
      secure: false
    };

    const result = await smtpService.verifyConnection(config);

    expect(mockCreateTransport).toHaveBeenCalledWith(expect.objectContaining({
      host: 'smtp.example.com',
      port: 587
    }));
    expect(result.success).toBe(true);
    expect(result.message).toContain('erfolgreich');
  });

  it('sollte EAUTH Fehler korrekt behandeln', async () => {
    const error: any = new Error('Auth failed');
    error.code = 'EAUTH';
    mockVerify.mockRejectedValue(error);

    const result = await smtpService.verifyConnection({
      host: 'smtp.test',
      port: 25,
      secure: false
    });

    expect(result.success).toBe(false);
    expect(result.message).toContain('Authentifizierung fehlgeschlagen');
  });

  it('sollte ETIMEDOUT Fehler korrekt behandeln', async () => {
    const error: any = new Error('Timeout');
    error.code = 'ETIMEDOUT';
    mockVerify.mockRejectedValue(error);

    const result = await smtpService.verifyConnection({
      host: 'smtp.test',
      port: 25,
      secure: false
    });

    expect(result.success).toBe(false);
    expect(result.message).toContain('Zeitüberschreitung');
  });
});