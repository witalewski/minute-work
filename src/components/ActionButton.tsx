import React from 'react';
import { Pressable, Text } from 'uniwind/components';

type ActionButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
};

export function ActionButton({
  label,
  onPress,
  variant = 'primary',
}: ActionButtonProps) {
  const buttonVariant =
    variant === 'primary'
      ? 'border-[#FF5538] bg-[#FF5538]'
      : variant === 'danger'
      ? 'border-[#CCC7BE] bg-transparent'
      : 'border-[#CCC7BE] bg-white';
  const textVariant =
    variant === 'primary'
      ? 'text-white'
      : 'text-[#292825]';

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      className={`min-h-14 flex-1 items-center justify-center rounded-xl border px-5 active:scale-[0.99] active:opacity-[0.74] ${buttonVariant}`}
      onPress={onPress}
    >
      <Text className={`text-[15px] font-[800] ${textVariant}`}>{label}</Text>
    </Pressable>
  );
}
