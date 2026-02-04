import { describe, it, expect, afterAll, beforeAll } from '@jest/globals';
import * as scanService from '../../src/services/scanService';
import net from 'net';

describe('Scan Service Unit Test', () => {
  let server: net.Server;
  const TEST_PORT = 3456;

  beforeAll((done) => {
    // Starte einen Dummy TCP Server
    server = net.createServer();
    server.listen(TEST_PORT, () => {
      done();
    });
  });

  afterAll((done) => {
    if (server) {
      server.close(done);
    } else {
      done();
    }
  });

  it('sollte einen offenen Port erkennen', async () => {
    const target = '127.0.0.1';
    const ports = `${TEST_PORT}`;

    const results = await scanService.scanTarget(target, ports);
    
    expect(results).toBeInstanceOf(Array);
    expect(results.length).toBeGreaterThan(0);
    const found = results.find(r => r.port === TEST_PORT);
    expect(found).toBeDefined();
    expect(found?.status).toBe('open');
  });

  it('sollte geschlossene Ports ignorieren (wenn status: O konfiguriert)', async () => {
    const target = '127.0.0.1';
    // Ein Port, der wahrscheinlich nicht belegt ist
    const unusedPort = 3457;
    const ports = `${unusedPort}`;

    const results = await scanService.scanTarget(target, ports);
    
    expect(results).toBeInstanceOf(Array);
    const found = results.find(r => r.port === unusedPort);
    expect(found).toBeUndefined();
  });
});