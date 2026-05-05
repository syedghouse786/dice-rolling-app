export interface GameSnapshot {
  totalScore: number;
  lastRoll: number | null;
  attemptsUsed: number;
}

export type ResetPhase = 'idle' | 'confirming' | 'countdown' | 'restoring';
