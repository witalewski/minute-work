import { useCallback, useEffect, useRef, useState } from 'react';

import {
  DEFAULT_ROUNDS,
  ROUND_OPTIONS,
  getTimerSnapshot,
  ROUND_SECONDS,
} from '../domain/timer';
import {
  playFeedback,
  prepareFeedback,
  stopFeedback,
} from '../feedback/workoutFeedback';
import { keepScreenAwake } from '../screen/keepScreenAwake';
import type { TimerStatus } from '../domain/timer';

export type EmomTimer = {
  rounds: number;
  developerMode: boolean;
  roundSeconds: number;
  roundOptions: readonly number[];
  toggleDeveloperMode: () => void;
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
  const [developerMode, setDeveloperMode] = useState(false);
  const roundSeconds = developerMode ? 10 : ROUND_SECONDS;
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
    const snapshot = getTimerSnapshot(workElapsedMs, rounds, roundSeconds);
    setCountdown(workElapsedMs < 0 ? 3 - second : null);
    setShowGo(workElapsedMs >= 0 && workElapsedMs < 1000);

    // Emit only the current cue, once: delayed ticks never replay old beeps.
    if (second !== lastSecondRef.current) {
      lastSecondRef.current = second;
      if (snapshot.complete) {
        playFeedback('complete');
      } else if (workElapsedMs < 0) {
        playFeedback('countdown');
      } else if (snapshot.secondsLeft === roundSeconds) {
        playFeedback('start');
      } else if (snapshot.currentRound < rounds && snapshot.secondsLeft <= 3) {
        playFeedback('countdown');
      }
    }

    setCurrentRound(snapshot.currentRound);
    setSecondsLeft(snapshot.secondsLeft);

    if (snapshot.complete) {
      elapsedAtPauseRef.current = 3000 + rounds * roundSeconds * 1000;
      setStatus('complete');
    }
  }, [rounds, roundSeconds]);

  useEffect(() => {
    if (status !== 'running') {
      return;
    }

    syncTimer();
    const timer = setInterval(syncTimer, 200);
    return () => clearInterval(timer);
  }, [status, syncTimer]);

  useEffect(() => {
    if (status === 'running') {
      return keepScreenAwake();
    }
  }, [status]);

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
    setSecondsLeft(roundSeconds);
    setStatus('running');
  }, [roundSeconds]);

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
    setSecondsLeft(roundSeconds);
    setStatus('setup');
  }, [roundSeconds]);

  const toggleDeveloperMode = useCallback(() => {
    reset();
    setDeveloperMode(!developerMode);
    setRounds(developerMode ? DEFAULT_ROUNDS : 2);
    setSecondsLeft(developerMode ? ROUND_SECONDS : 10);
  }, [developerMode, reset]);

  return {
    rounds,
    developerMode,
    roundSeconds,
    roundOptions: developerMode ? [1, 2, 3, 5] : ROUND_OPTIONS,
    toggleDeveloperMode,
    status,
    currentRound,
    secondsLeft,
    countdown,
    showGo,
    roundProgress:
      status === 'complete' ? 1 : (roundSeconds - secondsLeft) / roundSeconds,
    setRounds,
    start,
    pause,
    resume,
    reset,
  };
}
