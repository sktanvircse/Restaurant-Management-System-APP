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
import MenuItemRow from "../components/MenuItemRow";
import { useDataStore } from "../store/data";
import { RestaurantTheme } from "../theme";

export default function MenuListScreen({ navigation }: any) {
  const data = useDataStore();
  const [search, setSearch] = useState("");

  const items = data.menuItems.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.searchRow}>
        <TextInput
          placeholder="Search..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor={RestaurantTheme.colors.placeholder}
          style={[styles.input, { color: RestaurantTheme.colors.text }]}
        />
        <TouchableOpacity
          style={styles.add}
          onPress={() => navigation.navigate("MenuEdit", { mode: "create" })}
        >
          <Text style={styles.addText}>Add</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MenuItemRow
            item={item}
            onEdit={() =>
              navigation.navigate("MenuEdit", { mode: "edit", id: item.id })
            }
            onToggle={(available) =>
              data.updateMenuItem(item.id, { available })
            }
            onDelete={() =>
              Alert.alert("Delete item?", item.name, [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Delete",
                  style: "destructive",
                  onPress: () => data.deleteMenuItem(item.id),
                },
              ])
            }
          />
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", color:  RestaurantTheme.colors.hintText, marginTop: 24 }}>
            No items
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchRow: {
    flexDirection: "row",
    padding: 12,
    gap: 8,
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: RestaurantTheme.colors.inputBorder,
    borderRadius: 8,
    padding: 10,
    color: RestaurantTheme.colors.text,
    backgroundColor: RestaurantTheme.colors.background,
  },
  add: {
    backgroundColor: RestaurantTheme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addText: { color: RestaurantTheme.colors.buttonText, fontWeight: "700" },
  emptyText: {
    textAlign: "center",
    color: RestaurantTheme.colors.hintText,
    marginTop: 24,
    fontSize: 800,
  },
});
