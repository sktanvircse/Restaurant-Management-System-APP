import { useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Header from "../components/Header";
import OrderItemRow from "../components/OrderItemRow";
import { useDataStore } from "../store/data";
import { formatCurrency } from "../utils/currency";
import { RestaurantTheme } from "../theme";

export default function OrderCreateScreen({ route, navigation }: any) {
  const data = useDataStore();
  const orderId: string = route.params?.orderId;
  const tableId: string = route.params?.tableId;
  const order = data.orders.find((o) => o.id === orderId);

  const [search, setSearch] = useState("");

  const menu = data.menuItems
    .filter((m) => m.available)
    .filter((m) => m.name.toLowerCase().includes(search.toLowerCase()));

  const enrichedItems = useMemo(() => {
    if (!order) return [];
    return order.items.map((it) => {
      const mi = data.menuItems.find((m) => m.id === it.menuItemId);
      return { ...it, name: mi?.name ?? "Unknown", price: mi?.price ?? 0 };
    });
  }, [order, data.menuItems]);

  const total = useMemo(() => {
    return enrichedItems.reduce((sum, it) => sum + it.price * it.quantity, 0);
  }, [enrichedItems]);

  if (!order) {
    return (
      <View style={{ flex: 1, backgroundColor: RestaurantTheme.colors.background }}>
        <Header title="Order" />
        <Text style={{ padding: 16, color: RestaurantTheme.colors.primary }}>
          Order not found
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: RestaurantTheme.colors.background }}>
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Add Items</Text>
        <View style={styles.searchRow}>
          <TextInput
            placeholder="Search menu..."
            value={search}
            onChangeText={setSearch}
            placeholderTextColor={RestaurantTheme.colors.placeholder}
            style={[styles.input, { color: RestaurantTheme.colors.text }]}
          />
        </View>
        <FlatList
          data={menu}
          keyExtractor={(m) => m.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => data.addItemToOrder(orderId, item.id, 1)}
              style={styles.menuRow}
            >
              <Text style={{ flex: 1, color: RestaurantTheme.colors.text }}>
                {item.name}
              </Text>
              <Text style={{ color: RestaurantTheme.colors.primary }}>
                {formatCurrency(item.price)}
              </Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              No available menu items
            </Text>
          }
          style={{ maxHeight: 220 }}
        />

        <Text style={styles.sectionTitle}>Items in Order</Text>
        <FlatList
          data={enrichedItems}
          keyExtractor={(it) => it.id}
          renderItem={({ item }) => (
            <OrderItemRow
              item={item}
              name={item.name}
              price={item.price}
              onInc={() =>
                data.updateOrderItemQty(orderId, item.id, item.quantity + 1)
              }
              onDec={() => {
                const q = Math.max(1, item.quantity - 1);
                data.updateOrderItemQty(orderId, item.id, q);
              }}
              onRemove={() => data.removeOrderItem(orderId, item.id)}
            />
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              No items added yet
            </Text>
          }
        />

        <View style={styles.totalRow}>
          <Text style={styles.totalText}>Total</Text>
          <Text style={[styles.totalText, { color: RestaurantTheme.colors.primary }]}>
            {formatCurrency(total)}
          </Text>
        </View>

        <TouchableOpacity
          onPress={async () => {
            if (order.items.length === 0) {
              Alert.alert("Empty Order", "Add at least one item.");
              return;
            }
            await data.completeOrder(orderId);
            navigation.goBack();
          }}
          style={styles.completeBtn}
        >
          <Text style={styles.completeText}>Complete Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: RestaurantTheme.spacing.medium,
    gap: RestaurantTheme.spacing.small
  },
  sectionTitle: {
    fontWeight: 700,
    color: RestaurantTheme.colors.text,
    marginTop: RestaurantTheme.spacing.small,
    fontSize: RestaurantTheme.typography.label.fontSize,
  },
  searchRow: {
    flexDirection: "row",
    gap: RestaurantTheme.spacing.small
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: RestaurantTheme.colors.inputBorder,
    borderRadius: 8,
    padding: 10,
    color: RestaurantTheme.colors.text,
    backgroundColor: RestaurantTheme.colors.background,
    fontSize: 16,
  },
  menuRow: {
    paddingVertical: RestaurantTheme.spacing.small,
    paddingHorizontal: RestaurantTheme.spacing.medium,
    flexDirection: "row",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: RestaurantTheme.colors.cardBorder,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: RestaurantTheme.spacing.small,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: RestaurantTheme.colors.cardBorder,
  },
  totalText: {
    fontSize: RestaurantTheme.typography.title.fontSize,
    fontWeight: 800,
    color: RestaurantTheme.colors.text,
  },
  completeBtn: {
    backgroundColor: RestaurantTheme.colors.primary,
    padding: RestaurantTheme.spacing.medium,
    borderRadius: RestaurantTheme.borderRadius.medium,
    marginTop: RestaurantTheme.spacing.small,
  },
  completeText: {
    color: RestaurantTheme.colors.buttonText,
    textAlign: "center",
    fontWeight: 700,
    fontSize: RestaurantTheme.typography.button.fontSize,
  },
  emptyText: {
    textAlign: "center",
    color: RestaurantTheme.colors.hintText,
    marginVertical: RestaurantTheme.spacing.medium,
    fontSize: RestaurantTheme.typography.hint.fontSize,
  },
});