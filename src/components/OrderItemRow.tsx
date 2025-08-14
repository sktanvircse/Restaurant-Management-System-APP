import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { OrderItem } from '../store/data';
import { Ionicons } from '@expo/vector-icons';
import { RestaurantTheme } from '../theme';
import { formatCurrency } from '../utils/currency';

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
        <Text style={styles.meta}>
          {formatCurrency(price)} × {item.quantity}
        </Text>
      </View>
      <Text style={styles.price}>{formatCurrency(price * item.quantity)}</Text>
      <View style={styles.actions}>
        <TouchableOpacity onPress={onDec} style={styles.qtyButton}>
          <Ionicons name="remove" size={20} color={RestaurantTheme.colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onInc} style={styles.qtyButton}>
          <Ionicons name="add" size={20} color={RestaurantTheme.colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onRemove} style={styles.removeButton}>
          <Ionicons name="trash" size={18} color="#C41E3A" />
        </TouchableOpacity>
      </View>
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
  name: { 
    fontSize: RestaurantTheme.typography.label.fontSize,
    fontWeight: 600,
    color: RestaurantTheme.colors.text,
  },
  meta: { 
    color: RestaurantTheme.colors.placeholder,
    fontSize: RestaurantTheme.typography.hint.fontSize,
    marginTop: 2,
  },
  price: {
    fontWeight: 600,
    color: RestaurantTheme.colors.primary,
    minWidth: 60,
    textAlign: 'right',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: RestaurantTheme.spacing.small / 2,
  },
  qtyButton: {
    padding: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: RestaurantTheme.colors.inputBorder,
  },
  removeButton: {
    padding: 4,
    marginLeft: RestaurantTheme.spacing.small,
  },
});