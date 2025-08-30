import { useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuthStore } from "../store/auth";
import { useDataStore } from "../store/data";
import { RestaurantTheme } from "../theme";

export default function DashboardScreen() {
  const data = useDataStore();
  const logout = useAuthStore((s) => s.logout);

  const totals = useMemo(() => {
    const bookedTables = data.tables.filter((t) => t.status === "booked").length;
    const occupiedTables = data.tables.filter((t) => t.status === "occupied").length;
    const activeOrders = data.orders.filter((o) => o.status !== "completed").length;
    const completedOrders = data.orders.filter((o) => o.status === "completed").length;
    const totalOrders = data.orders.length;
    const menuCount = data.menuItems.length;

    return { bookedTables, occupiedTables, activeOrders, completedOrders, totalOrders, menuCount };
  }, [data.tables, data.orders, data.menuItems]);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.wrap}>
        <View style={styles.grid}>
          <Card label="Booked Tables" value={totals.bookedTables} color="#FFA000" />
          <Card label="Occupied Tables" value={totals.occupiedTables} color="#E53935" />
        </View>
        <View style={styles.grid}>
          <Card label="Active Orders" value={totals.activeOrders} color="#4CAF50" />
          <Card label="Completed Orders" value={totals.completedOrders} color="#9E9E9E" />
        </View>
        <View style={styles.grid}>
          <Card label="Total Orders" value={totals.totalOrders} color="#1976D2" />
          <Card label="Menu Items" value={totals.menuCount} color="#8E24AA" />
        </View>
      </ScrollView>

      {/* Fixed Logout Button */}
      <View style={styles.logoutContainer}>
        <TouchableOpacity onPress={logout} style={styles.logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function Card({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <View style={[styles.card, { borderLeftColor: color, borderLeftWidth: 6 }]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, { color }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 16, gap: 16 },
  grid: { flexDirection: "row", gap: 12 },
  card: {
    flex: 1,
    backgroundColor: RestaurantTheme.colors.cardBackground,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    elevation: 2,
    borderWidth: 1,
    borderColor: RestaurantTheme.colors.cardBorder,
  },
  value: { fontSize: 28, fontWeight: "800" },
  label: { color: RestaurantTheme.colors.text, marginBottom: 5, fontSize: 14 },

  logoutContainer: {
    padding: 16,
  },
  logout: {
    backgroundColor: RestaurantTheme.colors.primary,
    padding: 16,
    borderRadius: 10,
    elevation: 2,
  },
  logoutText: {
    color: RestaurantTheme.colors.buttonText,
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
  },
});
