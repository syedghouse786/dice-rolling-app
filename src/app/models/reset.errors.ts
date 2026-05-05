export class NothingToResetError extends Error {
  override readonly name = 'NothingToResetError';
  constructor() { super('No rolls to reset'); }
}

export class CorruptedSnapshotError extends Error {
  override readonly name = 'CorruptedSnapshotError';
  constructor() { super('Unable to restore game state'); }
}

export type ResetError = NothingToResetError | CorruptedSnapshotError;
