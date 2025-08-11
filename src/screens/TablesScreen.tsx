import React, { useState } from "react";
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
import TableRow from "../components/TableRow";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TablesScreen({ navigation }: any) {
  const data = useDataStore();
  const [name, setName] = useState("");

  const onAdd = async () => {
    const n = name.trim();
    if (!n) return;
    await data.addTable(n);
    setName("");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Header title="Tables" />
        <View style={styles.addRow}>
          <TextInput
            placeholder="New table name"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
          <TouchableOpacity style={styles.add} onPress={onAdd}>
            <Text style={styles.addText}>Add</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={data.tables}
          keyExtractor={(t) => t.id}
          renderItem={({ item }) => (
            <TableRow
              table={item}
              onOpen={async () => {
                const orderId = await data.createOrderForTable(item.id);
                navigation.navigate("OrderCreate", {
                  orderId,
                  tableId: item.id,
                });
              }}
              onDelete={() =>
                Alert.alert("Delete table?", item.name, [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => data.deleteTable(item.id),
                  },
                ])
              }
            />
          )}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", color: "#888", marginTop: 24 }}>
              No tables
            </Text>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  addRow: { flexDirection: "row", padding: 12, gap: 8, alignItems: "center" },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
  },
  add: {
    backgroundColor: "#111",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addText: { color: "#fff", fontWeight: "700" },
});
