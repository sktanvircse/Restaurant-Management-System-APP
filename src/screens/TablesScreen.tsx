import { useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import TableRow from "../components/TableRow";
import { useDataStore } from "../store/data";
import { RestaurantTheme } from "../theme";

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
    <View style={{ flex: 1 }}>
      <View style={styles.addRow}>
        <TextInput
          placeholder="New table name"
          value={name}
          onChangeText={setName}
          placeholderTextColor={RestaurantTheme.colors.placeholder}
          style={[styles.input, { color: RestaurantTheme.colors.text }]}
        />
        <TouchableOpacity style={styles.add} onPress={onAdd}>
          <Text style={styles.addText}>Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={data.tables}
        keyExtractor={(t) => t.id}
        renderItem={({ item }) => (
          <View>
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
          </View>
        )}
        ListEmptyComponent={
          <Text
            style={{
              textAlign: "center",
              color: RestaurantTheme.colors.hintText,
              marginTop: 24,
            }}
          >
            No tables
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  addRow: { flexDirection: "row", padding: 12, gap: 8, alignItems: "center" },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: RestaurantTheme.colors.inputBorder,
    borderRadius: 8,
    padding: 14,
    color: RestaurantTheme.colors.text,
    backgroundColor: RestaurantTheme.colors.background,
    fontSize: 16,
  },
  add: {
    backgroundColor: RestaurantTheme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 8,
  },
  addText: { color: RestaurantTheme.colors.buttonText, fontWeight: "700" },
  statusButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 12,
    paddingVertical: 4,
    gap: 8,
  },
  statusBtn: {
    backgroundColor: RestaurantTheme.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  statusBtnText: {
    color: RestaurantTheme.colors.buttonText,
    fontWeight: "600",
  },
});
