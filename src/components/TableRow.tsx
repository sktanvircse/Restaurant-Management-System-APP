import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Table } from '../store/data';
import { RestaurantTheme } from '../theme';

type Props = {
  table: Table;
  onOpen: () => void;
  onDelete: () => void;
};

export default function TableRow({ table, onOpen, onDelete }: Props) {
  return (
    <View style={[
      styles.row,
      table.status === 'available' ? styles.available : styles.occupied
    ]}>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{table.name}</Text>
        <Text style={styles.meta}>
          {table.status === 'available' ? 'Available' : 'Occupied'}
        </Text>
      </View>
      <TouchableOpacity 
        onPress={onOpen} 
        style={[
          styles.btn,
          table.status === 'available' ? styles.newOrderBtn : styles.openOrderBtn
        ]}
      >
        <Text style={styles.btnText}>
          {table.status === 'available' ? 'New Order' : 'Open Order'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onDelete} style={styles.deleteBtn}>
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: RestaurantTheme.spacing.medium,
    paddingVertical: RestaurantTheme.spacing.small,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: RestaurantTheme.colors.cardBorder,
    flexDirection: 'row',
    alignItems: 'center',
    gap: RestaurantTheme.spacing.small,
    backgroundColor: RestaurantTheme.colors.cardBackground,
  },
  available: {
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50', // Green for available tables
  },
  occupied: {
    borderLeftWidth: 4,
    borderLeftColor: RestaurantTheme.colors.primary, // Red for occupied tables
  },
  name: { 
    fontSize: RestaurantTheme.typography.label.fontSize,
    fontWeight: 600,
    color: RestaurantTheme.colors.text,
  },
  meta: { 
    color: RestaurantTheme.colors.placeholder,
    fontSize: RestaurantTheme.typography.hint.fontSize,
  },
  btn: {
    paddingHorizontal: RestaurantTheme.spacing.small,
    paddingVertical: RestaurantTheme.spacing.small / 2,
    borderRadius: RestaurantTheme.borderRadius.small,
  },
  newOrderBtn: {
    backgroundColor: RestaurantTheme.colors.primary,
  },
  openOrderBtn: {
    backgroundColor: '#FFA000', // Amber for open order button
  },
  btnText: {
    color: RestaurantTheme.colors.buttonText,
    fontWeight: 700,
    fontSize: RestaurantTheme.typography.button.fontSize,
  },
  deleteBtn: {
    paddingHorizontal: RestaurantTheme.spacing.small,
  },
  deleteText: {
    color: '#C41E3A', // Darker red for delete
    fontWeight: 700,
  },
});