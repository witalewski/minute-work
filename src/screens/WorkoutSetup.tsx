import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '../components/ActionButton';
import { ROUND_OPTIONS } from '../domain/timer';

type WorkoutSetupProps = {
  compact: boolean;
  rounds: number;
  onRoundsChange: (rounds: number) => void;
  onStart: () => void;
};

export function WorkoutSetup({
  compact,
  rounds,
  onRoundsChange,
  onStart,
}: WorkoutSetupProps) {
  return (
    <View style={styles.setupContent} accessibilityLabel="Workout setup">
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
            <Text
              accessibilityLabel={`${rounds} minute workout`}
              style={styles.configValue}
            >
              {rounds} minutes
            </Text>
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
                accessibilityState={{ selected }}
                key={option}
                onPress={() => onRoundsChange(option)}
                style={({ pressed }) => [
                  styles.roundOption,
                  selected && styles.roundOptionSelected,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Text
                  style={[
                    styles.roundOptionNumber,
                    selected && styles.roundOptionNumberSelected,
                  ]}
                >
                  {option}
                </Text>
                <Text
                  style={[
                    styles.roundOptionLabel,
                    selected && styles.roundOptionLabelSelected,
                  ]}
                >
                  ROUNDS
                </Text>
              </Pressable>
            );
          })}
        </View>

        <ActionButton label="Start workout  →" onPress={onStart} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
      web: { boxShadow: '0 18px 50px rgba(40, 36, 28, 0.08)' },
      default: {
        shadowColor: '#2A261D',
        shadowOffset: { width: 0, height: 14 },
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
  buttonPressed: {
    opacity: 0.74,
    transform: [{ scale: 0.99 }],
  },
});
