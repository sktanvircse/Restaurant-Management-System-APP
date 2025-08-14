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
    const activeOrders = data.orders.filter(
      (o) => o.status === "active"
    ).length;
    const menuCount = data.menuItems.length;
    const activeTables = data.tables.filter(
      (t) => t.status === "occupied"
    ).length;
    return { activeOrders, menuCount, activeTables };
  }, [data.orders, data.menuItems, data.tables]);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.wrap}>
        <View style={styles.grid}>
          <Card label="Active Orders" value={totals.activeOrders} />
          <Card label="Active Tables" value={totals.activeTables} />
          <Card label="Menu Items" value={totals.menuCount} />
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

function Card({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 16, gap: 12 },
  grid: { flexDirection: "row", gap: 8 },
  card: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: RestaurantTheme.colors.cardBackground,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    elevation: 2,
    borderWidth: 1,
    borderColor: RestaurantTheme.colors.cardBorder,
  },
  value: { fontSize: 28, fontWeight: "800", color: RestaurantTheme.colors.text },
  label: { color: RestaurantTheme.colors.text, marginBottom: 5, fontSize: 12 },

  logoutContainer: {
    padding: 16,
  },
  logout: {
    backgroundColor: RestaurantTheme.colors.primary,
    padding: 16,
    borderRadius: 10,
    marginTop: 16,
    elevation: 2,
  },
  logoutText: {
    color: RestaurantTheme.colors.buttonText,
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
  },
});
