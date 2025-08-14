import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { MenuItem } from '../store/data';
import { formatCurrency } from '../utils/currency';
import { RestaurantTheme } from '../theme';

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
      <Switch value={item.available} onValueChange={onToggle} trackColor={{
        false: RestaurantTheme.colors.cardBorder,
        true: RestaurantTheme.colors.primary
      }}
        thumbColor={RestaurantTheme.colors.cardBackground} />
      <TouchableOpacity onPress={onEdit} style={styles.action}>
        <Text style={styles.link}>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onDelete} style={styles.action}>
        <Text style={[styles.link, { color: RestaurantTheme.colors.primary }]}>Delete</Text>
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
  name: { 
    fontSize: RestaurantTheme.typography.label.fontSize,
    fontWeight: 700,
    color: RestaurantTheme.colors.text,
  },
  meta: { 
    color: RestaurantTheme.colors.placeholder,
    fontSize: RestaurantTheme.typography.hint.fontSize,
  },
  action: { 
    marginLeft: RestaurantTheme.spacing.small,
  },
  link: { 
    color: RestaurantTheme.colors.linkText, 
    fontWeight: 700,
  },
});