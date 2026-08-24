import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function AppFooter() {
  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>ONE MINUTE. ONE JOB.</Text>
      <Text style={styles.footerMeta}>No account · No distractions</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#D8D3C8',
    paddingTop: 16,
  },
  footerText: {
    color: '#6D6962',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.4,
  },
  footerMeta: {
    color: '#9A958C',
    fontSize: 10,
  },
});
