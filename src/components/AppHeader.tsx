import React from 'react';
import { Text, View } from 'uniwind/components';

export function AppHeader() {
  return (
    <View className="min-h-[46px] flex-row items-center border-b border-[#D8D3C8] pb-[15px]">
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
    </View>
  );
}
