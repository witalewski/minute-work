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
      className={`h-[46px] flex-row items-center border-b border-[#D8D3C8] ${
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
          <Text className="flex-1 text-lg font-[800] tracking-[-0.4px] text-[#20201E]">
            Minute Work
          </Text>
          <View className="rounded-full border border-[#BDB8AE] px-2.5 py-[5px]">
            <Text className="text-[10px] font-[800] tracking-[1.4px] text-[#65625D]">
              EMOM
            </Text>
          </View>
        </>
      )}
    </Pressable>
  );
}
