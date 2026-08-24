import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function AppHeader() {
  return (
    <View style={styles.header}>
      <View style={styles.brandMark}>
        <View style={styles.brandMarkInner} />
      </View>
      <Text style={styles.brand}>Minute Work</Text>
      <View style={styles.headerBadge}>
        <Text style={styles.headerBadgeText}>EMOM</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#D8D3C8',
    paddingBottom: 15,
  },
  brandMark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF5538',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  brandMarkInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F7F4ED',
  },
  brand: {
    flex: 1,
    color: '#20201E',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  headerBadge: {
    borderWidth: 1,
    borderColor: '#BDB8AE',
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  headerBadgeText: {
    color: '#65625D',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.4,
  },
});
