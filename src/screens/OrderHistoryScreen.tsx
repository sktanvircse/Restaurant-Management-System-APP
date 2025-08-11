import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import Header from "../components/Header";
import { useDataStore } from "../store/data";
import { formatCurrency } from "../utils/currency";
import { format } from "date-fns";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OrderHistoryScreen() {
  const data = useDataStore();
  const [filter, setFilter] = useState<"active" | "completed" | "all">(
    "active"
  );

  const orders = useMemo(() => {
    return data.orders.filter((o) =>
      filter === "all" ? true : o.status === filter
    );
  }, [data.orders, filter]);

  const totalOf = (orderId: string) => {
    const order = data.orders.find((o) => o.id === orderId);
    if (!order) return 0;
    return order.items.reduce((sum, it) => {
      const m = data.menuItems.find((mi) => mi.id === it.menuItemId);
      return sum + (m?.price ?? 0) * it.quantity;
    }, 0);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Header title="Orders" />
        <View style={styles.filters}>
          <FilterButton
            label="Active"
            active={filter === "active"}
            onPress={() => setFilter("active")}
          />
          <FilterButton
            label="Completed"
            active={filter === "completed"}
            onPress={() => setFilter("completed")}
          />
          <FilterButton
            label="All"
            active={filter === "all"}
            onPress={() => setFilter("all")}
          />
        </View>
        <FlatList
          data={orders}
          keyExtractor={(o) => o.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.title}>
                Table{" "}
                {data.tables.find((t) => t.id === item.tableId)?.name ?? ""}
              </Text>
              <Text style={styles.meta}>
                {item.status === "active" ? "Active" : "Completed"} •{" "}
                {format(new Date(item.createdAt), "PPp")}
              </Text>
              <Text style={styles.total}>
                Total {formatCurrency(totalOf(item.id))}
              </Text>
            </View>
          )}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", color: "#888", marginTop: 24 }}>
              No orders
            </Text>
          }
          contentContainerStyle={{ padding: 12, gap: 8 }}
        />
      </View>
    </SafeAreaView>
  );
}

function FilterButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.filter, active && styles.filterActive]}
    >
      <Text style={[styles.filterText, active && styles.filterTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  filters: { flexDirection: "row", gap: 8, padding: 12 },
  filter: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#eee",
    borderRadius: 16,
  },
  filterActive: { backgroundColor: "#111" },
  filterText: { color: "#111" },
  filterTextActive: { color: "#fff" },
  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    elevation: 2,
  },
  title: { fontSize: 16, fontWeight: "700" },
  meta: { color: "#666", marginTop: 4 },
  total: { fontWeight: "800", marginTop: 8 },
});
