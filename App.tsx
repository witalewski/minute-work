import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

const ROUND_SECONDS = 60;
const ROUND_OPTIONS = [5, 10, 15, 20];

type TimerStatus = 'setup' | 'running' | 'paused' | 'complete';

export function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

type ActionButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
};

function ActionButton({label, onPress, variant = 'primary'}: ActionButtonProps) {
  const variantStyle =
    variant === 'primary'
      ? styles.primaryButton
      : variant === 'danger'
        ? styles.dangerButton
        : styles.secondaryButton;
  const textStyle =
    variant === 'primary' ? styles.primaryButtonText : styles.secondaryButtonText;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({pressed}) => [
        styles.actionButton,
        variantStyle,
        pressed && styles.buttonPressed,
      ]}>
      <Text style={[styles.actionButtonText, textStyle]}>{label}</Text>
    </Pressable>
  );
}

export default function App() {
  const {width} = useWindowDimensions();
  const compact = width < 520;
  const [rounds, setRounds] = useState(10);
  const [status, setStatus] = useState<TimerStatus>('setup');
  const [currentRound, setCurrentRound] = useState(1);
  const [secondsLeft, setSecondsLeft] = useState(ROUND_SECONDS);
  const startedAtRef = useRef(0);
  const elapsedAtPauseRef = useRef(0);

  const syncTimer = useCallback(() => {
    const elapsedMs = Date.now() - startedAtRef.current;
    const totalDurationMs = rounds * ROUND_SECONDS * 1000;

    if (elapsedMs >= totalDurationMs) {
      elapsedAtPauseRef.current = totalDurationMs;
      setCurrentRound(rounds);
      setSecondsLeft(0);
      setStatus('complete');
      return;
    }

    const elapsedWholeSeconds = Math.floor(elapsedMs / 1000);
    setCurrentRound(Math.floor(elapsedWholeSeconds / ROUND_SECONDS) + 1);
    setSecondsLeft(ROUND_SECONDS - (elapsedWholeSeconds % ROUND_SECONDS));
  }, [rounds]);

  useEffect(() => {
    if (status !== 'running') {
      return;
    }

    syncTimer();
    const timer = setInterval(syncTimer, 200);
    return () => clearInterval(timer);
  }, [status, syncTimer]);

  const startWorkout = () => {
    elapsedAtPauseRef.current = 0;
    startedAtRef.current = Date.now();
    setCurrentRound(1);
    setSecondsLeft(ROUND_SECONDS);
    setStatus('running');
  };

  const pauseWorkout = () => {
    elapsedAtPauseRef.current = Date.now() - startedAtRef.current;
    setStatus('paused');
  };

  const resumeWorkout = () => {
    startedAtRef.current = Date.now() - elapsedAtPauseRef.current;
    setStatus('running');
  };

  const resetWorkout = () => {
    elapsedAtPauseRef.current = 0;
    setCurrentRound(1);
    setSecondsLeft(ROUND_SECONDS);
    setStatus('setup');
  };

  const roundProgress =
    status === 'complete' ? 1 : (ROUND_SECONDS - secondsLeft) / ROUND_SECONDS;

  return (
    <View style={styles.app}>
      <StatusBar barStyle="dark-content" backgroundColor="#F7F4ED" />
      <View style={[styles.shell, compact && styles.shellCompact]}>
        <View style={styles.header}>
          <View style={styles.brandMark}>
            <View style={styles.brandMarkInner} />
          </View>
          <Text style={styles.brand}>Minute Work</Text>
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>EMOM</Text>
          </View>
        </View>

        {status === 'setup' ? (
          <View style={styles.setupContent}>
            <View style={styles.eyebrowRow}>
              <View style={styles.eyebrowLine} />
              <Text style={styles.eyebrow}>EVERY MINUTE ON THE MINUTE</Text>
            </View>
            <Text style={[styles.heroTitle, compact && styles.heroTitleCompact]}>
              Show up every minute.
            </Text>
            <Text style={styles.heroBody}>
              Choose your rounds. You’ll get one focused minute at a time—work,
              breathe, repeat.
            </Text>

            <View style={styles.configCard}>
              <View style={styles.configHeadingRow}>
                <View>
                  <Text style={styles.configLabel}>WORKOUT LENGTH</Text>
                  <Text style={styles.configValue}>{rounds} minutes</Text>
                </View>
                <View style={styles.minuteChip}>
                  <Text style={styles.minuteChipValue}>60</Text>
                  <Text style={styles.minuteChipLabel}>SEC / ROUND</Text>
                </View>
              </View>

              <View style={styles.optionRow}>
                {ROUND_OPTIONS.map(option => {
                  const selected = rounds === option;
                  return (
                    <Pressable
                      accessibilityLabel={`${option} rounds`}
                      accessibilityRole="button"
                      accessibilityState={{selected}}
                      key={option}
                      onPress={() => setRounds(option)}
                      style={({pressed}) => [
                        styles.roundOption,
                        selected && styles.roundOptionSelected,
                        pressed && styles.buttonPressed,
                      ]}>
                      <Text
                        style={[
                          styles.roundOptionNumber,
                          selected && styles.roundOptionNumberSelected,
                        ]}>
                        {option}
                      </Text>
                      <Text
                        style={[
                          styles.roundOptionLabel,
                          selected && styles.roundOptionLabelSelected,
                        ]}>
                        ROUNDS
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <ActionButton label="Start workout  →" onPress={startWorkout} />
            </View>
          </View>
        ) : (
          <View style={styles.timerContent}>
            <View style={styles.timerHeadingRow}>
              <View>
                <Text style={styles.eyebrow}>CURRENT INTERVAL</Text>
                <Text style={styles.roundHeading}>
                  {status === 'complete' ? 'Workout complete' : `Round ${currentRound}`}
                </Text>
              </View>
              <Text style={styles.roundCount}>
                {currentRound} <Text style={styles.roundCountMuted}>/ {rounds}</Text>
              </Text>
            </View>

            <View style={[styles.timerCard, compact && styles.timerCardCompact]}>
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
                style={[styles.timer, compact && styles.timerCompact]}>
                {formatTime(secondsLeft)}
              </Text>
              <Text style={styles.timerCaption}>
                {status === 'complete'
                  ? `${rounds} rounds finished. Nice work.`
                  : 'until the next minute'}
              </Text>

              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    {width: `${Math.round(roundProgress * 100)}%`},
                  ]}
                />
              </View>
            </View>

            <View style={[styles.controlRow, compact && styles.controlRowCompact]}>
              {status === 'running' && (
                <ActionButton label="Pause" onPress={pauseWorkout} variant="secondary" />
              )}
              {status === 'paused' && (
                <ActionButton label="Resume" onPress={resumeWorkout} />
              )}
              {status === 'complete' && (
                <ActionButton label="Go again" onPress={startWorkout} />
              )}
              <ActionButton label="Reset" onPress={resetWorkout} variant="danger" />
            </View>
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>ONE MINUTE. ONE JOB.</Text>
          <Text style={styles.footerMeta}>No account · No distractions</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    minHeight: '100%',
    backgroundColor: '#F7F4ED',
  },
  shell: {
    flex: 1,
    width: '100%',
    maxWidth: 980,
    alignSelf: 'center',
    paddingTop: Platform.OS === 'ios' ? 58 : 32,
    paddingHorizontal: 40,
    paddingBottom: 24,
  },
  shellCompact: {
    paddingTop: Platform.OS === 'ios' ? 52 : 22,
    paddingHorizontal: 20,
  },
  header: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#D8D3C8',
    paddingBottom: 15,
  },
  brandMark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF5538',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  brandMarkInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F7F4ED',
  },
  brand: {
    flex: 1,
    color: '#20201E',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  headerBadge: {
    borderWidth: 1,
    borderColor: '#BDB8AE',
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  headerBadgeText: {
    color: '#65625D',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.4,
  },
  setupContent: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 36,
  },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  eyebrowLine: {
    width: 30,
    height: 2,
    backgroundColor: '#FF5538',
    marginRight: 10,
  },
  eyebrow: {
    color: '#6D6962',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  heroTitle: {
    maxWidth: 680,
    color: '#20201E',
    fontSize: 62,
    lineHeight: 64,
    fontWeight: '900',
    letterSpacing: -2.8,
  },
  heroTitleCompact: {
    fontSize: 42,
    lineHeight: 44,
    letterSpacing: -1.8,
  },
  heroBody: {
    maxWidth: 560,
    marginTop: 18,
    color: '#66625C',
    fontSize: 17,
    lineHeight: 26,
  },
  configCard: {
    marginTop: 36,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0DDD6',
    padding: 22,
    ...Platform.select({
      web: {boxShadow: '0 18px 50px rgba(40, 36, 28, 0.08)'},
      default: {
        shadowColor: '#2A261D',
        shadowOffset: {width: 0, height: 14},
        shadowOpacity: 0.08,
        shadowRadius: 28,
      },
    }),
  },
  configHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 22,
  },
  configLabel: {
    color: '#89847B',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.3,
  },
  configValue: {
    marginTop: 5,
    color: '#20201E',
    fontSize: 25,
    fontWeight: '800',
    letterSpacing: -0.7,
  },
  minuteChip: {
    alignItems: 'center',
    backgroundColor: '#F2EEE5',
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingVertical: 8,
  },
  minuteChipValue: {
    color: '#20201E',
    fontSize: 18,
    fontWeight: '900',
  },
  minuteChipLabel: {
    color: '#89847B',
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  optionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  roundOption: {
    flex: 1,
    minHeight: 68,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DCD8D0',
    backgroundColor: '#FAF9F6',
  },
  roundOptionSelected: {
    borderColor: '#20201E',
    backgroundColor: '#20201E',
  },
  roundOptionNumber: {
    color: '#343330',
    fontSize: 20,
    fontWeight: '800',
  },
  roundOptionNumberSelected: {
    color: '#FFFFFF',
  },
  roundOptionLabel: {
    marginTop: 2,
    color: '#99948A',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  roundOptionLabelSelected: {
    color: '#BDB9B0',
  },
  actionButton: {
    minHeight: 56,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 20,
  },
  primaryButton: {
    backgroundColor: '#FF5538',
    borderColor: '#FF5538',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#CCC7BE',
  },
  dangerButton: {
    backgroundColor: 'transparent',
    borderColor: '#CCC7BE',
  },
  buttonPressed: {
    opacity: 0.74,
    transform: [{scale: 0.99}],
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: '800',
  },
  primaryButtonText: {
    color: '#FFFFFF',
  },
  secondaryButtonText: {
    color: '#292825',
  },
  timerContent: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 30,
  },
  timerHeadingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 18,
  },
  roundHeading: {
    marginTop: 5,
    color: '#20201E',
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: -1,
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#D8D3C8',
    paddingTop: 16,
  },
  footerText: {
    color: '#6D6962',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.4,
  },
  footerMeta: {
    color: '#9A958C',
    fontSize: 10,
  },
});
