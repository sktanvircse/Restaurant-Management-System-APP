import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Table, useDataStore } from '../store/data';
import { RestaurantTheme } from '../theme';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';

type Props = {
  table: Table;
  onOpen: () => void;
  onDelete: () => void;
};

export default function TableRow({ table, onOpen, onDelete }: Props) {
  const data = useDataStore();

  return (
    <View style={[
      styles.row,
      table.status === 'available' ? styles.available : styles.occupied
    ]}>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{table.name}</Text>
        <Text style={styles.meta}>
          {table.status.charAt(0).toUpperCase() + table.status.slice(1)}
        </Text>
      </View>

      {/* Order button */}
      <TouchableOpacity
        onPress={onOpen}
        style={[
          styles.statusBtn,
          table.status === 'available' ? styles.newOrderBtn : styles.openOrderBtn
        ]}
      >
        <MaterialIcons
          name="receipt"
          size={20}
          color={RestaurantTheme.colors.buttonText}
        />
      </TouchableOpacity>

      {/* Status buttons */}
      <View style={styles.statusButtons}>
        {table.status === 'available' && (
          <TouchableOpacity
            style={styles.statusBtn}
            onPress={() => data.bookTable(table.id)}
          >
            <MaterialIcons name="book" size={20} color="white" />
          </TouchableOpacity>
        )}

        {table.status !== 'occupied' && (
          <TouchableOpacity
            style={styles.statusBtn}
            onPress={() => data.occupyTable(table.id)}
          >
            <MaterialIcons name="event-seat" size={20} color="white" />
          </TouchableOpacity>
        )}

        {table.status == 'booked' && (
          <TouchableOpacity
            style={styles.statusBtn}
            onPress={() => data.releaseTable(table.id)}
          >
            <FontAwesome5 name="door-open" size={20} color="white" />
          </TouchableOpacity>
        )}
      </View>

      {/* Delete button */}
      <TouchableOpacity onPress={onDelete} style={styles.deleteBtn}>
        <MaterialIcons name="delete" size={22} color="#C41E3A" />
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
    borderLeftColor: '#4CAF50', // Green
  },
  occupied: {
    borderLeftWidth: 4,
    borderLeftColor: RestaurantTheme.colors.primary, // Red
  },
  name: {
    fontSize: RestaurantTheme.typography.label.fontSize,
    fontWeight: '600',
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
    backgroundColor: '#FFA000',
  },
  btnText: {
    color: RestaurantTheme.colors.buttonText,
    fontWeight: '700',
    fontSize: RestaurantTheme.typography.button.fontSize,
  },
  deleteBtn: {
    paddingHorizontal: RestaurantTheme.spacing.small,
  },
  deleteText: {
    color: '#C41E3A',
    fontWeight: '700',
  },
  statusButtons: {
    flexDirection: 'row',
    gap: 6,
  },
  statusBtn: {
    backgroundColor: RestaurantTheme.colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  statusBtnText: {
    color: RestaurantTheme.colors.buttonText,
    fontWeight: '600',
    fontSize: 12,
  },
});
