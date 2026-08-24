export const ROUND_SECONDS = 60;
export const ROUND_OPTIONS = [5, 10, 15, 20] as const;
export const DEFAULT_ROUNDS = 10;

export type TimerStatus = 'setup' | 'running' | 'paused' | 'complete';

export type TimerSnapshot = {
  currentRound: number;
  secondsLeft: number;
  complete: boolean;
};

export function formatTime(totalSeconds: number): string {
  const normalizedSeconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(normalizedSeconds / 60);
  const seconds = normalizedSeconds % 60;

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
    2,
    '0',
  )}`;
}

export function getTimerSnapshot(
  elapsedMs: number,
  totalRounds: number,
  roundSeconds = ROUND_SECONDS,
): TimerSnapshot {
  const normalizedElapsedMs = Math.max(0, elapsedMs);
  const totalDurationMs = totalRounds * roundSeconds * 1000;

  if (normalizedElapsedMs >= totalDurationMs) {
    return {
      currentRound: totalRounds,
      secondsLeft: 0,
      complete: true,
    };
  }

  const elapsedWholeSeconds = Math.floor(normalizedElapsedMs / 1000);

  return {
    currentRound: Math.floor(elapsedWholeSeconds / roundSeconds) + 1,
    secondsLeft: roundSeconds - (elapsedWholeSeconds % roundSeconds),
    complete: false,
  };
}
