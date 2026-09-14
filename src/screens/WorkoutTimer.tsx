import React from 'react';
import { Text, View } from 'uniwind/components';

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
  countdown: number | null;
  showGo: boolean;
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
  countdown,
  showGo,
  start,
  pause,
  resume,
  reset,
}: WorkoutTimerProps) {
  return (
    <View
      className={`flex-1 justify-center ${short ? 'py-3' : 'py-[30px]'}`}
      accessibilityLabel={`Workout ${status}`}
    >
      <View
        className={`flex-row items-end justify-between ${
          short ? 'mb-2.5' : 'mb-[18px]'
        }`}
      >
        <View>
          <Text className="text-[11px] font-[800] tracking-[1.5px] text-[#6D6962] dark:text-[#A8A39A]">
            CURRENT INTERVAL
          </Text>
          <Text
            accessibilityLabel={`Round ${currentRound} of ${rounds}`}
            className={`mt-[5px] font-[900] tracking-[-1px] text-[#20201E] dark:text-[#F2EFE8] ${
              short ? 'text-[26px]' : 'text-[30px]'
            }`}
          >
            {status === 'complete'
              ? 'Workout complete'
              : `Round ${currentRound}`}
          </Text>
        </View>
        <Text className="text-xl font-[800] text-[#20201E] dark:text-[#F2EFE8]">
          {currentRound} <Text className="text-[#99948A] dark:text-[#8A857C]">/ {rounds}</Text>
        </Text>
      </View>

      <View
        className={`items-center justify-center rounded-3xl bg-[#20201E] dark:bg-[#26241F] ${
          short
            ? 'min-h-[250px] p-[18px]'
            : compact
            ? 'min-h-[300px] p-6'
            : 'min-h-[360px] p-9'
        }`}
      >
        <View className="flex-row items-center">
          <View
            className={`mr-2 h-2 w-2 rounded-full ${
              status === 'paused'
                ? 'bg-[#F2C14E]'
                : status === 'complete'
                ? 'bg-[#7FD09B]'
                : 'bg-[#FF5538]'
            }`}
          />
          <Text className="text-[11px] font-[900] tracking-[2px] text-white">
            {status === 'running'
              ? countdown !== null
                ? 'GET READY'
                : 'WORK'
              : status === 'paused'
              ? 'PAUSED'
              : 'DONE'}
          </Text>
        </View>

        <Text
          accessibilityLabel={
            countdown !== null
              ? `Starting in ${countdown}`
              : showGo
              ? 'Go!'
              : `${secondsLeft} seconds remaining`
          }
          className={`mt-3 font-[900] tabular-nums text-white ${
            short
              ? 'text-[68px] leading-[78px] tracking-[-3px]'
              : compact
              ? 'text-[76px] leading-[88px] tracking-[-4px]'
              : 'text-[112px] leading-[124px] tracking-[-6px]'
          }`}
        >
          {countdown !== null
            ? countdown
            : showGo
            ? 'Go!'
            : formatTime(secondsLeft)}
        </Text>
        <Text className="text-[13px] text-[#A9A69F]">
          {status === 'complete'
            ? `${rounds} rounds finished. Nice work.`
            : countdown !== null
            ? 'until your first round'
            : showGo
            ? 'Your first minute starts now'
            : currentRound === rounds
            ? 'until your workout is complete'
            : 'until the next minute'}
        </Text>

        <View
          className={`h-[5px] w-full overflow-hidden rounded bg-[#41403D] dark:bg-[#45423C] ${
            short ? 'mt-5' : 'mt-8'
          }`}
        >
          <View
            accessibilityLabel={`${Math.round(
              roundProgress * 100,
            )}% interval complete`}
            className="h-full rounded bg-[#FF5538]"
            style={{ width: `${Math.round(roundProgress * 100)}%` }}
          />
        </View>
      </View>

      <View
        className={`${compact ? 'flex-col' : 'flex-row'} ${
          short ? 'mt-2.5 gap-2' : 'mt-4 gap-3'
        }`}
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
