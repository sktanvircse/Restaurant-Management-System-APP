import { format } from "date-fns";
import { useMemo, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDataStore } from "../store/data";
import { formatCurrency } from "../utils/currency";
import { RestaurantTheme } from "../theme";

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
    <View style={{ flex: 1 }}>
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
        renderItem={({ item }) => {
          const isActive = item.status !== "completed"; // define active orders
          return (
            <View style={[styles.card, isActive && styles.activeCard]}>
              <Text style={styles.title}>
                Table{" "}
                {data.tables.find((t) => t.id === item.tableId)?.name ?? ""}
              </Text>
              <Text style={styles.meta}>
                {(() => {
                  switch (item.status) {
                    case "pending":
                      return "Pending";
                    case "sentToKitchen":
                      return "Sent to Kitchen";
                    case "confirmed":
                      return "Confirmed";
                    case "completed":
                      return "Completed";
                    default:
                      return item.status;
                  }
                })()} • {format(new Date(item.createdAt), "PPp")}
              </Text>
              <Text style={styles.total}>
                Total {formatCurrency(totalOf(item.id))}
              </Text>
            </View>
          );
        }}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", color: RestaurantTheme.colors.hintText, marginTop: 24 }}>
            No orders
          </Text>
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
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
  filters: {
    flexDirection: "row",
    gap: RestaurantTheme.spacing.small,
    padding: RestaurantTheme.spacing.medium,
    backgroundColor: RestaurantTheme.colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: RestaurantTheme.colors.cardBorder,
  },
  filter: {
    paddingHorizontal: RestaurantTheme.spacing.medium,
    paddingVertical: RestaurantTheme.spacing.small,
    backgroundColor: RestaurantTheme.colors.background,
    borderRadius: RestaurantTheme.borderRadius.large,
    borderWidth: 1,
    borderColor: RestaurantTheme.colors.inputBorder,
  },
  filterActive: {
    backgroundColor: RestaurantTheme.colors.primary,
    borderColor: RestaurantTheme.colors.primary,
  },
  filterText: {
    color: RestaurantTheme.colors.text,
    fontWeight: 700,
  },
  filterTextActive: {
    color: RestaurantTheme.colors.buttonText,
  },
  listContent: {
    padding: RestaurantTheme.spacing.medium,
    gap: RestaurantTheme.spacing.small
  },
  card: {
    backgroundColor: RestaurantTheme.colors.cardBackground,
    padding: RestaurantTheme.spacing.medium,
    borderRadius: RestaurantTheme.borderRadius.medium,
    borderWidth: 1,
    borderColor: RestaurantTheme.colors.cardBorder,
  },
  activeCard: {
    borderLeftWidth: 4,
    borderLeftColor: RestaurantTheme.colors.primary,
  },
  title: {
    fontSize: RestaurantTheme.typography.label.fontSize,
    fontWeight: 800,
    color: RestaurantTheme.colors.text,
  },
  meta: {
    color: RestaurantTheme.colors.placeholder,
    marginTop: RestaurantTheme.spacing.small,
    fontSize: RestaurantTheme.typography.hint.fontSize,
  },
  total: {
    fontWeight: 800,
    marginTop: RestaurantTheme.spacing.small,
    color: RestaurantTheme.colors.primary,
  },
});
