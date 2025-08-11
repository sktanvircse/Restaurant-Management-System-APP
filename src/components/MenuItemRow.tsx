import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { MenuItem } from '../store/data';
import { formatCurrency } from '../utils/currency';

type Props = {
  item: MenuItem;
  onEdit: () => void;
  onToggle: (available: boolean) => void;
  onDelete: () => void;
};

export default function MenuItemRow({ item, onEdit, onToggle, onDelete }: Props) {
  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.meta}>
          {item.category || 'Uncategorized'} • {formatCurrency(item.price)}
        </Text>
      </View>
      <Switch value={item.available} onValueChange={onToggle} />
      <TouchableOpacity onPress={onEdit} style={styles.action}>
        <Text style={styles.link}>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onDelete} style={styles.action}>
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
  action: { marginLeft: 8 },
  link: { color: '#007AFF', fontWeight: '600' },
});