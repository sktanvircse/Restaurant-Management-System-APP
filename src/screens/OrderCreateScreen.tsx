import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import Header from "../components/Header";
import { useDataStore } from "../store/data";
import OrderItemRow from "../components/OrderItemRow";
import { formatCurrency } from "../utils/currency";
import { SafeAreaView } from "react-native-safe-area-context";

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
      <View style={{ flex: 1 }}>
        <Header title="Order" />
        <Text style={{ padding: 16, color: "#c00" }}>Order not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Header
          title={`Order • Table ${
            data.tables.find((t) => t.id === tableId)?.name ?? ""
          }`}
        />
        <View style={styles.container}>
          <Text style={styles.sectionTitle}>Add Items</Text>
          <View style={styles.searchRow}>
            <TextInput
              placeholder="Search menu..."
              value={search}
              onChangeText={setSearch}
              style={styles.input}
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
                <Text style={{ flex: 1 }}>{item.name}</Text>
                <Text>{formatCurrency(item.price)}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={{ textAlign: "center", color: "#888" }}>
                No items
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
              <Text style={{ textAlign: "center", color: "#888" }}>
                No items yet
              </Text>
            }
          />

          <View style={styles.totalRow}>
            <Text style={styles.totalText}>Total</Text>
            <Text style={styles.totalText}>{formatCurrency(total)}</Text>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 8 },
  sectionTitle: { fontWeight: "700", marginTop: 8 },
  searchRow: { flexDirection: "row", gap: 8 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
  },
  menuRow: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#eee",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#eee",
  },
  totalText: { fontSize: 18, fontWeight: "800" },
  completeBtn: {
    backgroundColor: "#0a7",
    padding: 14,
    borderRadius: 10,
    marginTop: 8,
  },
  completeText: { color: "#fff", textAlign: "center", fontWeight: "700" },
});
