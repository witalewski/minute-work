import React from 'react';
import { Text, View } from 'uniwind/components';

export function AppFooter() {
  return (
    <View className="flex-row items-center justify-between border-t border-[#D8D3C8] pt-4 dark:border-[#3A3733]">
      <Text className="text-[9px] font-[900] tracking-[1.4px] text-[#6D6962] dark:text-[#A8A39A]">
        ONE MINUTE. ONE JOB.
      </Text>
      <Text className="text-[10px] text-[#9A958C] dark:text-[#7D786F]">
        No account · No distractions
      </Text>
    </View>
  );
}
