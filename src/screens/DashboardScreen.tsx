import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Header from "../components/Header";
import { useDataStore } from "../store/data";
import { useAuthStore } from "../store/auth";
import { SafeAreaView } from "react-native-safe-area-context";

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
    <SafeAreaView style={{ flex: 1 }}>
      <Header title="Dashboard" />
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
    </SafeAreaView>
  );
}

function Card({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.card}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 16, gap: 12 },
  grid: { flexDirection: "row", gap: 8 },
  card: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    elevation: 2
  },
  value: { fontSize: 28, fontWeight: "800" },
  label: { color: "#666", marginTop: 4, },

  // Fixed button styles
  logoutContainer: {
    padding: 16,
    backgroundColor: "#f6f6f6",
  },
  logout: {
    backgroundColor: "#e33",
    padding: 12,
    borderRadius: 10,
  },
  logoutText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
  },
});
