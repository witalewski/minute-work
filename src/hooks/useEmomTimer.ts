import { useCallback, useEffect, useRef, useState } from 'react';

import {
  DEFAULT_ROUNDS,
  getTimerSnapshot,
  ROUND_SECONDS,
} from '../domain/timer';
import {
  playFeedback,
  prepareFeedback,
  stopFeedback,
} from '../feedback/workoutFeedback';
import type { TimerStatus } from '../domain/timer';

export type EmomTimer = {
  rounds: number;
  status: TimerStatus;
  currentRound: number;
  secondsLeft: number;
  roundProgress: number;
  countdown: number | null;
  showGo: boolean;
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
  const [countdown, setCountdown] = useState<number | null>(null);
  const [showGo, setShowGo] = useState(false);
  const lastSecondRef = useRef(-1);
  const startedAtRef = useRef(0);
  const elapsedAtPauseRef = useRef(0);

  const syncTimer = useCallback(() => {
    const elapsedMs = Date.now() - startedAtRef.current;
    const second = Math.floor(elapsedMs / 1000);
    const workElapsedMs = elapsedMs - 3000;
    const snapshot = getTimerSnapshot(workElapsedMs, rounds);
    setCountdown(workElapsedMs < 0 ? 3 - second : null);
    setShowGo(workElapsedMs >= 0 && workElapsedMs < 1000);

    // Emit only the current cue, once: delayed ticks never replay old beeps.
    if (second !== lastSecondRef.current) {
      lastSecondRef.current = second;
      if (snapshot.complete) {
        playFeedback('complete');
      } else if (workElapsedMs < 0) {
        playFeedback('countdown');
      } else if (snapshot.secondsLeft === ROUND_SECONDS) {
        playFeedback('start');
      } else if (snapshot.currentRound < rounds && snapshot.secondsLeft <= 3) {
        playFeedback('countdown');
      }
    }

    setCurrentRound(snapshot.currentRound);
    setSecondsLeft(snapshot.secondsLeft);

    if (snapshot.complete) {
      elapsedAtPauseRef.current = 3000 + rounds * ROUND_SECONDS * 1000;
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

  useEffect(() => stopFeedback, []);

  const start = useCallback(() => {
    stopFeedback();
    prepareFeedback();
    lastSecondRef.current = -1;
    setCountdown(3);
    setShowGo(false);
    elapsedAtPauseRef.current = 0;
    startedAtRef.current = Date.now();
    setCurrentRound(1);
    setSecondsLeft(ROUND_SECONDS);
    setStatus('running');
  }, []);

  const pause = useCallback(() => {
    stopFeedback();
    elapsedAtPauseRef.current = Date.now() - startedAtRef.current;
    setStatus('paused');
  }, []);

  const resume = useCallback(() => {
    prepareFeedback();
    startedAtRef.current = Date.now() - elapsedAtPauseRef.current;
    setStatus('running');
  }, []);

  const reset = useCallback(() => {
    stopFeedback();
    setCountdown(null);
    setShowGo(false);
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
    countdown,
    showGo,
    roundProgress:
      status === 'complete' ? 1 : (ROUND_SECONDS - secondsLeft) / ROUND_SECONDS,
    setRounds,
    start,
    pause,
    resume,
    reset,
  };
}
