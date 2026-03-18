export interface RollResult {
  values: number[];  // Individual die values (each 1–6)
  total: number;     // Sum of all values
}

export interface RollEntry {
  values: number[];   // Individual die values
  total: number;      // Sum of all values
  timestamp: number;  // Date.now() at time of roll
}
