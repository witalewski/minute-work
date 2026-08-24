import { useCallback, useEffect, useRef, useState } from 'react';

import {
  DEFAULT_ROUNDS,
  getTimerSnapshot,
  ROUND_SECONDS,
} from '../domain/timer';
import type { TimerStatus } from '../domain/timer';

export type EmomTimer = {
  rounds: number;
  status: TimerStatus;
  currentRound: number;
  secondsLeft: number;
  roundProgress: number;
  setRounds: (rounds: number) => void;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
};

export function useEmomTimer(): EmomTimer {
  const [rounds, setRounds] = useState(DEFAULT_ROUNDS);
  const [status, setStatus] = useState<TimerStatus>('setup');
  const [currentRound, setCurrentRound] = useState(1);
  const [secondsLeft, setSecondsLeft] = useState(ROUND_SECONDS);
  const startedAtRef = useRef(0);
  const elapsedAtPauseRef = useRef(0);

  const syncTimer = useCallback(() => {
    const elapsedMs = Date.now() - startedAtRef.current;
    const snapshot = getTimerSnapshot(elapsedMs, rounds);

    setCurrentRound(snapshot.currentRound);
    setSecondsLeft(snapshot.secondsLeft);

    if (snapshot.complete) {
      elapsedAtPauseRef.current = rounds * ROUND_SECONDS * 1000;
      setStatus('complete');
    }
  }, [rounds]);

  useEffect(() => {
    if (status !== 'running') {
      return;
    }

    syncTimer();
    const timer = setInterval(syncTimer, 200);
    return () => clearInterval(timer);
  }, [status, syncTimer]);

  const start = useCallback(() => {
    elapsedAtPauseRef.current = 0;
    startedAtRef.current = Date.now();
    setCurrentRound(1);
    setSecondsLeft(ROUND_SECONDS);
    setStatus('running');
  }, []);

  const pause = useCallback(() => {
    elapsedAtPauseRef.current = Date.now() - startedAtRef.current;
    setStatus('paused');
  }, []);

  const resume = useCallback(() => {
    startedAtRef.current = Date.now() - elapsedAtPauseRef.current;
    setStatus('running');
  }, []);

  const reset = useCallback(() => {
    elapsedAtPauseRef.current = 0;
    setCurrentRound(1);
    setSecondsLeft(ROUND_SECONDS);
    setStatus('setup');
  }, []);

  return {
    rounds,
    status,
    currentRound,
    secondsLeft,
    roundProgress:
      status === 'complete' ? 1 : (ROUND_SECONDS - secondsLeft) / ROUND_SECONDS,
    setRounds,
    start,
    pause,
    resume,
    reset,
  };
}
