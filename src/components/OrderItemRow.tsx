import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { OrderItem } from '../store/data';

type Props = {
  item: OrderItem;
  name: string;
  price: number;
  onInc: () => void;
  onDec: () => void;
  onRemove: () => void;
};

export default function OrderItemRow({ item, name, price, onInc, onDec, onRemove }: Props) {
  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.meta}>Qty: {item.quantity}</Text>
      </View>
      <Text style={styles.meta}>${(price * item.quantity).toFixed(2)}</Text>
      <TouchableOpacity onPress={onDec} style={styles.action}>
        <Text style={styles.link}>-</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onInc} style={styles.action}>
        <Text style={styles.link}>+</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onRemove} style={styles.action}>
        <Text style={[styles.link, { color: '#c00' }]}>Remove</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  name: { fontSize: 16, fontWeight: '600' },
  meta: { color: '#666' },
  action: { marginLeft: 8 },
  link: { color: '#007AFF', fontWeight: '600' },
});