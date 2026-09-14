import React from 'react';
import { Pressable, Text, View } from 'uniwind/components';

import { ActionButton } from '../components/ActionButton';

type WorkoutSetupProps = {
  compact: boolean;
  rounds: number;
  roundSeconds: number;
  roundOptions: readonly number[];
  onRoundsChange: (rounds: number) => void;
  onStart: () => void;
};

export function WorkoutSetup({
  compact,
  rounds,
  roundSeconds,
  roundOptions,
  onRoundsChange,
  onStart,
}: WorkoutSetupProps) {
  return (
    <View
      className="flex-1 justify-center py-9"
      accessibilityLabel="Workout setup"
    >
      <View className="mb-[18px] flex-row items-center">
        <View className="mr-2.5 h-0.5 w-[30px] bg-[#FF5538]" />
        <Text className="text-[11px] font-[800] tracking-[1.5px] text-[#6D6962] dark:text-[#A8A39A]">
          EVERY MINUTE ON THE MINUTE
        </Text>
      </View>
      <Text
        className={`max-w-[680px] font-[900] text-[#20201E] dark:text-[#F2EFE8] ${
          compact
            ? 'text-[42px] leading-[44px] tracking-[-1.8px]'
            : 'text-[62px] leading-[64px] tracking-[-2.8px]'
        }`}
      >
        Show up every minute.
      </Text>
      <Text className="mt-[18px] max-w-[560px] text-[17px] leading-[26px] text-[#66625C] dark:text-[#A39E94]">
        Choose your rounds. You’ll get one focused minute at a time—work,
        breathe, repeat.
      </Text>

      <View className="mt-9 rounded-[20px] border border-[#E0DDD6] bg-white p-[22px] shadow-[0_18px_50px_rgba(40,36,28,0.08)] native:shadow-[0_14px_28px_rgba(42,38,29,0.08)] dark:border-[#33302B] dark:bg-[#211F1B] dark:shadow-[0_18px_50px_rgba(0,0,0,0.5)] dark:native:shadow-[0_14px_28px_rgba(0,0,0,0.5)]">
        <View className="mb-[22px] flex-row items-center justify-between">
          <View>
            <Text className="text-[10px] font-[800] tracking-[1.3px] text-[#89847B] dark:text-[#8F8A81]">
              WORKOUT LENGTH
            </Text>
            <Text
              accessibilityLabel={`${rounds} minute workout`}
              className="mt-[5px] text-[25px] font-[800] tracking-[-0.7px] text-[#20201E] dark:text-[#F2EFE8]"
            >
              {rounds} minutes
            </Text>
          </View>
          <View className="items-center rounded-xl bg-[#F2EEE5] px-[13px] py-2 dark:bg-[#2A2723]">
            <Text className="text-lg font-[900] text-[#20201E] dark:text-[#F2EFE8]">
              {roundSeconds}
            </Text>
            <Text className="text-[7px] font-[800] tracking-[0.8px] text-[#89847B] dark:text-[#8F8A81]">
              SEC / ROUND
            </Text>
          </View>
        </View>

        <View className="mb-[18px] flex-row gap-2.5">
          {roundOptions.map(option => {
            const selected = rounds === option;
            return (
              <Pressable
                accessibilityLabel={`${option} rounds`}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                className={`min-h-[68px] flex-1 items-center justify-center rounded-xl border active:scale-[0.99] active:opacity-[0.74] ${
                  selected
                    ? 'border-[#20201E] bg-[#20201E] dark:border-[#F2EFE8] dark:bg-[#F2EFE8]'
                    : 'border-[#DCD8D0] bg-[#FAF9F6] dark:border-[#36332E] dark:bg-[#26231F]'
                }`}
                key={option}
                onPress={() => onRoundsChange(option)}
              >
                <Text
                  className={`text-xl font-[800] ${
                    selected
                      ? 'text-white dark:text-[#171512]'
                      : 'text-[#343330] dark:text-[#E8E4DB]'
                  }`}
                >
                  {option}
                </Text>
                <Text
                  className={`mt-0.5 text-[8px] font-[800] tracking-[0.8px] ${
                    selected
                      ? 'text-[#BDB9B0] dark:text-[#6E6A63]'
                      : 'text-[#99948A] dark:text-[#8A857C]'
                  }`}
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
