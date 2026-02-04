declare module 'evilscan' {
  import { EventEmitter } from 'events';

  interface EvilscanOptions {
    target: string;
    port?: string;
    reverse?: boolean;
    reverseValid?: boolean;
    geo?: boolean;
    status?: string;
    timeout?: number;
    banner?: boolean;
  }

  interface EvilscanResult {
    ip: string;
    port: number;
    status: string; // 'open', 'closed', etc.
    banner?: string;
  }

  class Evilscan extends EventEmitter {
    constructor(options: EvilscanOptions);
    run(): void;
    on(event: 'result', listener: (data: EvilscanResult) => void): this;
    on(event: 'error', listener: (err: Error) => void): this;
    on(event: 'done', listener: () => void): this;
  }

  export = Evilscan;
}