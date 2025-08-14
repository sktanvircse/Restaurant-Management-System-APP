import { useMemo, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDataStore } from "../store/data";
import { RestaurantTheme } from "../theme";

export default function MenuEditScreen({ route, navigation }: any) {
  const data = useDataStore();
  const mode: "create" | "edit" = route.params?.mode ?? "create";
  const id: string | undefined = route.params?.id;

  const current = useMemo(
    () => data.menuItems.find((m) => m.id === id),
    [data.menuItems, id]
  );

  const [name, setName] = useState(current?.name ?? "");
  const [price, setPrice] = useState(current?.price?.toString() ?? "");
  const [category, setCategory] = useState(current?.category ?? "");
  const [available, setAvailable] = useState(current?.available ?? true);

  const onSave = async () => {
    const p = parseFloat(price);
    if (!name.trim()) {
      Alert.alert("Validation", "Name is required.");
      return;
    }
    if (!Number.isFinite(p) || p < 0) {
      Alert.alert("Validation", "Price must be a positive number.");
      return;
    }

    if (mode === "create") {
      await data.addMenuItem({
        name: name.trim(),
        price: p,
        category: category.trim(),
        available,
      });
    } else if (current) {
      await data.updateMenuItem(current.id, {
        name: name.trim(),
        price: p,
        category: category.trim(),
        available,
      });
    }
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.form}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="e.g. Caesar Salad"
          placeholderTextColor={RestaurantTheme.colors.placeholder}
          style={[styles.input, { color: RestaurantTheme.colors.text }]}
        />
        <Text style={styles.label}>Price ($)</Text>
        <TextInput
          value={price}
          onChangeText={setPrice}
          keyboardType="decimal-pad"
          placeholder="9.99"
          placeholderTextColor={RestaurantTheme.colors.placeholder}
          style={[styles.input, { color: RestaurantTheme.colors.text }]}
        />
        <Text style={styles.label}>Category</Text>
        <TextInput
          value={category}
          onChangeText={setCategory}
          placeholder="Mains / Drinks ..."
          placeholderTextColor={RestaurantTheme.colors.placeholder}
          style={[styles.input, { color: RestaurantTheme.colors.text }]}
        />
        <TouchableOpacity
          onPress={() => setAvailable((v) => !v)}
          style={[
            styles.switch,
            {
              backgroundColor: available
                ? "#4CAF50"
                : "#5E3023",
            }
          ]}
        >
          <Text style={styles.switchText}>{available ? "Available" : "Unavailable"}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onSave} style={styles.button}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  form: { padding: 16, gap: 8 },
  label: { fontWeight: "600", color: RestaurantTheme.colors.text },
  input: {
    borderWidth: 1,
    borderColor: RestaurantTheme.colors.inputBorder,
    borderRadius: 8,
    padding: 14,
    color: RestaurantTheme.colors.text,
    backgroundColor: RestaurantTheme.colors.background,
    fontSize: 16,
  },
  switch: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  switchText: {
    color: "#ffffffff",
    fontWeight: 700,
  },
  button: {
    backgroundColor: RestaurantTheme.colors.primary,
    padding: 14,
    borderRadius: 10,
    marginTop: 8,
  },
  buttonText: { color: RestaurantTheme.colors.buttonText, textAlign: "center", fontWeight: "700", fontSize: 16, },
});
