import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function EmptyState({ text }: { text: string }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    padding: 24,
    alignItems: 'center',
  },
  text: {
    color: '#888',
  },
});