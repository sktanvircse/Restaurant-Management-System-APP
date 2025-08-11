import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useAuthStore } from "../store/auth";
import { isValidEmail, isValidPin } from "../utils/validations";

export default function LoginScreen() {
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");

  const onSubmit = async () => {
    if (!isValidEmail(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email.");
      return;
    }
    if (!isValidPin(pw)) {
      Alert.alert("Invalid Password", "Password must be 4–6 digits.");
      return;
    }
    const ok = await login(email.trim().toLowerCase(), pw);
    if (!ok) {
      Alert.alert("Login Failed", "Email or password incorrect.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
      <Text style={styles.title}>Restaurant Manager</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          inputMode="email"
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="demo@example.com"
          placeholderTextColor="#888" // ← explicitly set
          style={[styles.input, { color: "#000" }]} // ← text color
        />
        <Text style={styles.label}>Password (4–6 digits)</Text>
        <TextInput
          value={pw}
          onChangeText={setPw}
          placeholder="1234"
          placeholderTextColor="#888" // ← explicitly set
          secureTextEntry
          keyboardType="number-pad"
          style={[styles.input, { color: "#000" }]} // ← text color
          maxLength={6}
        />
        <TouchableOpacity onPress={onSubmit} style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <Text style={styles.hint}>Default: demo@example.com / 1234</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#f6f6f6",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    gap: 8,
    elevation: 2,
  },
  label: { fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    color: "#000", // text color
  },
  button: {
    backgroundColor: "#111",
    padding: 14,
    borderRadius: 10,
    marginTop: 8,
  },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "700" },
  hint: { color: "#888", textAlign: "center", marginTop: 8 },
});
