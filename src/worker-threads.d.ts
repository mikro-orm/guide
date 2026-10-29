import type { Transferable } from 'node:worker_threads';

declare module 'worker_threads' {
  export type TransferListItem = Transferable;
}
