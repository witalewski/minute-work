import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

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
  const variantStyle =
    variant === 'primary'
      ? styles.primaryButton
      : variant === 'danger'
      ? styles.dangerButton
      : styles.secondaryButton;
  const textStyle =
    variant === 'primary'
      ? styles.primaryButtonText
      : styles.secondaryButtonText;

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.actionButton,
        variantStyle,
        pressed && styles.buttonPressed,
      ]}
    >
      <Text style={[styles.actionButtonText, textStyle]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
    transform: [{ scale: 0.99 }],
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
});
