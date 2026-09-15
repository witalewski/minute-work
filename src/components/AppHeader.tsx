import React, { useRef, useState } from 'react';
import { Pressable, Text, View } from 'uniwind/components';
import { EmomGuide } from './EmomGuide';

export function AppHeader({
  developerMode,
  onToggleDeveloperMode,
}: {
  developerMode: boolean;
  onToggleDeveloperMode: () => void;
}) {
  const [guideVisible, setGuideVisible] = useState(false);
  const taps = useRef<number[]>([]);
  const onPress = () => {
    const now = Date.now();
    taps.current = taps.current.filter(time => now - time <= 2000);
    taps.current.push(now);
    if (taps.current.length === 5) {
      taps.current = [];
      onToggleDeveloperMode();
    }
  };
  return (
    <>
      <View className="flex-row items-center border-b border-[#D8D3C8] dark:border-[#3A3733]">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={developerMode ? 'Developer mode' : 'Minute Work'}
          onPress={onPress}
          className={`min-h-[46px] flex-1 flex-row items-center ${
            developerMode ? 'bg-[#FF5538]' : 'pb-[15px]'
          }`}
        >
          {developerMode ? (
            <Text
              numberOfLines={1}
              className="flex-1 text-center text-lg font-[800] text-[#20201E]"
            >
              Developer mode
            </Text>
          ) : (
            <>
              <View className="mr-2.5 h-6 w-6 items-center justify-center rounded-full bg-[#FF5538]">
                <View className="h-2 w-2 rounded-full bg-[#F7F4ED]" />
              </View>
              <Text className="flex-1 text-lg font-[800] tracking-[-0.4px] text-[#20201E] dark:text-[#F2EFE8]">
                Minute Work
              </Text>
            </>
          )}
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="About EMOM training"
          accessibilityHint="Opens a guide to EMOM and using the timer"
          onPress={() => setGuideVisible(true)}
          className="min-h-11 min-w-11 justify-center pb-[10px] pl-3"
        >
          <View className="rounded-full border border-[#BDB8AE] px-2.5 py-[5px] dark:border-[#4A463F]">
            <Text className="text-[10px] font-[800] tracking-[1.4px] text-[#65625D] dark:text-[#A39E94]">
              What is EMOM?
            </Text>
          </View>
        </Pressable>
      </View>
      {guideVisible && <EmomGuide onClose={() => setGuideVisible(false)} />}
    </>
  );
}
