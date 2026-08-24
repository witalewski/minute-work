import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '../components/ActionButton';
import { formatTime } from '../domain/timer';
import type { TimerStatus } from '../domain/timer';

type WorkoutTimerProps = {
  compact: boolean;
  short: boolean;
  rounds: number;
  status: TimerStatus;
  currentRound: number;
  secondsLeft: number;
  roundProgress: number;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
};

export function WorkoutTimer({
  compact,
  short,
  rounds,
  status,
  currentRound,
  secondsLeft,
  roundProgress,
  start,
  pause,
  resume,
  reset,
}: WorkoutTimerProps) {
  return (
    <View
      style={[styles.timerContent, short && styles.timerContentShort]}
      accessibilityLabel={`Workout ${status}`}
    >
      <View
        style={[styles.timerHeadingRow, short && styles.timerHeadingRowShort]}
      >
        <View>
          <Text style={styles.eyebrow}>CURRENT INTERVAL</Text>
          <Text
            accessibilityLabel={`Round ${currentRound} of ${rounds}`}
            style={[styles.roundHeading, short && styles.roundHeadingShort]}
          >
            {status === 'complete'
              ? 'Workout complete'
              : `Round ${currentRound}`}
          </Text>
        </View>
        <Text style={styles.roundCount}>
          {currentRound} <Text style={styles.roundCountMuted}>/ {rounds}</Text>
        </Text>
      </View>

      <View
        style={[
          styles.timerCard,
          compact && styles.timerCardCompact,
          short && styles.timerCardShort,
        ]}
      >
        <View style={styles.statusRow}>
          <View
            style={[
              styles.liveDot,
              status === 'paused' && styles.pausedDot,
              status === 'complete' && styles.completeDot,
            ]}
          />
          <Text style={styles.statusText}>
            {status === 'running'
              ? 'WORK'
              : status === 'paused'
              ? 'PAUSED'
              : 'DONE'}
          </Text>
        </View>

        <Text
          accessibilityLabel={`${secondsLeft} seconds remaining`}
          style={[
            styles.timer,
            compact && styles.timerCompact,
            short && styles.timerShort,
          ]}
        >
          {formatTime(secondsLeft)}
        </Text>
        <Text style={styles.timerCaption}>
          {status === 'complete'
            ? `${rounds} rounds finished. Nice work.`
            : 'until the next minute'}
        </Text>

        <View
          style={[styles.progressTrack, short && styles.progressTrackShort]}
        >
          <View
            accessibilityLabel={`${Math.round(
              roundProgress * 100,
            )}% interval complete`}
            style={[
              styles.progressFill,
              { width: `${Math.round(roundProgress * 100)}%` },
            ]}
          />
        </View>
      </View>

      <View
        style={[
          styles.controlRow,
          compact && styles.controlRowCompact,
          short && styles.controlRowShort,
        ]}
      >
        {status === 'running' && (
          <ActionButton label="Pause" onPress={pause} variant="secondary" />
        )}
        {status === 'paused' && (
          <ActionButton label="Resume" onPress={resume} />
        )}
        {status === 'complete' && (
          <ActionButton label="Go again" onPress={start} />
        )}
        <ActionButton label="Reset" onPress={reset} variant="danger" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  timerContent: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 30,
  },
  timerContentShort: {
    paddingVertical: 12,
  },
  timerHeadingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 18,
  },
  timerHeadingRowShort: {
    marginBottom: 10,
  },
  eyebrow: {
    color: '#6D6962',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  roundHeading: {
    marginTop: 5,
    color: '#20201E',
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: -1,
  },
  roundHeadingShort: {
    fontSize: 26,
  },
  roundCount: {
    color: '#20201E',
    fontSize: 20,
    fontWeight: '800',
  },
  roundCountMuted: {
    color: '#99948A',
  },
  timerCard: {
    minHeight: 360,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    backgroundColor: '#20201E',
    padding: 36,
  },
  timerCardCompact: {
    minHeight: 300,
    padding: 24,
  },
  timerCardShort: {
    minHeight: 250,
    padding: 18,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
    backgroundColor: '#FF5538',
  },
  pausedDot: {
    backgroundColor: '#F2C14E',
  },
  completeDot: {
    backgroundColor: '#7FD09B',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 2,
  },
  timer: {
    marginTop: 12,
    color: '#FFFFFF',
    fontSize: 112,
    lineHeight: 124,
    fontWeight: '900',
    letterSpacing: -6,
    fontVariant: ['tabular-nums'],
  },
  timerCompact: {
    fontSize: 76,
    lineHeight: 88,
    letterSpacing: -4,
  },
  timerShort: {
    fontSize: 68,
    lineHeight: 78,
    letterSpacing: -3,
  },
  timerCaption: {
    color: '#A9A69F',
    fontSize: 13,
  },
  progressTrack: {
    width: '100%',
    height: 5,
    marginTop: 32,
    overflow: 'hidden',
    borderRadius: 4,
    backgroundColor: '#41403D',
  },
  progressTrackShort: {
    marginTop: 20,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: '#FF5538',
  },
  controlRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  controlRowCompact: {
    flexDirection: 'column',
  },
  controlRowShort: {
    gap: 8,
    marginTop: 10,
  },
});
