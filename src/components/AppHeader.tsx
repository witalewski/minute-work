import React, { useRef } from 'react';
import { Pressable, Text, View } from 'uniwind/components';

export function AppHeader({
  developerMode,
  onToggleDeveloperMode,
}: {
  developerMode: boolean;
  onToggleDeveloperMode: () => void;
}) {
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
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={developerMode ? 'Developer mode' : 'Minute Work'}
      onPress={onPress}
      className={`h-[46px] flex-row items-center border-b border-[#D8D3C8] dark:border-[#3A3733] ${
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
          <View className="rounded-full border border-[#BDB8AE] px-2.5 py-[5px] dark:border-[#4A463F]">
            <Text className="text-[10px] font-[800] tracking-[1.4px] text-[#65625D] dark:text-[#A39E94]">
              EMOM
            </Text>
          </View>
        </>
      )}
    </Pressable>
  );
}
