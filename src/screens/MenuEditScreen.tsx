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
          style={styles.input}
          placeholder="e.g. Caesar Salad"
        />
        <Text style={styles.label}>Price ($)</Text>
        <TextInput
          value={price}
          onChangeText={setPrice}
          style={styles.input}
          keyboardType="decimal-pad"
          placeholder="9.99"
        />
        <Text style={styles.label}>Category</Text>
        <TextInput
          value={category}
          onChangeText={setCategory}
          style={styles.input}
          placeholder="Mains / Drinks ..."
        />
        <TouchableOpacity
          onPress={() => setAvailable((v) => !v)}
          style={styles.switch}
        >
          <Text>{available ? "Available" : "Unavailable"}</Text>
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
  label: { fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
  },
  switch: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#eee",
  },
  button: {
    backgroundColor: "#111",
    padding: 14,
    borderRadius: 10,
    marginTop: 8,
  },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "700" },
});
