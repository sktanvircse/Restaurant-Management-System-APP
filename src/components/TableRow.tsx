import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Table } from '../store/data';

type Props = {
  table: Table;
  onOpen: () => void;
  onDelete: () => void;
};

export default function TableRow({ table, onOpen, onDelete }: Props) {
  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{table.name}</Text>
        <Text style={styles.meta}>{table.status === 'available' ? 'Available' : 'Occupied'}</Text>
      </View>
      <TouchableOpacity onPress={onOpen} style={styles.btn}>
        <Text style={styles.link}>{table.status === 'available' ? 'New Order' : 'Open Order'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onDelete}>
        <Text style={[styles.link, { color: '#c00' }]}>Delete</Text>
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
  link: { color: '#007AFF', fontWeight: '600' },
  btn: { marginRight: 8 },
});