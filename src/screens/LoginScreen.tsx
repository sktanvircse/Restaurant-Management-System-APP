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
import { RestaurantTheme } from "../theme";

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
          placeholderTextColor={RestaurantTheme.colors.placeholder}
          style={[styles.input, { color: RestaurantTheme.colors.text }]}
        />
        <Text style={styles.label}>Password (4–6 digits)</Text>
        <TextInput
          value={pw}
          onChangeText={setPw}
          placeholder="1234"
          placeholderTextColor={RestaurantTheme.colors.placeholder}
          secureTextEntry
          keyboardType="number-pad"
          style={[styles.input, { color: RestaurantTheme.colors.text }]}
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
    backgroundColor: RestaurantTheme.colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 16,
    color: RestaurantTheme.colors.primary,
  },
  card: {
    backgroundColor: RestaurantTheme.colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    gap: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: RestaurantTheme.colors.cardBorder,
  },
  label: {
    fontWeight: "600",
    color: RestaurantTheme.colors.text,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: RestaurantTheme.colors.inputBorder,
    borderRadius: 8,
    padding: 14,
    color: RestaurantTheme.colors.text,
    backgroundColor: RestaurantTheme.colors.background,
    fontSize: 16,
  },
  button: {
    backgroundColor: RestaurantTheme.colors.primary,
    padding: 16,
    borderRadius: 10,
    marginTop: 16,
    elevation: 2,
  },
  buttonText: {
    color: RestaurantTheme.colors.buttonText,
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
  },
  hint: {
    color: RestaurantTheme.colors.hintText,
    textAlign: "center",
    marginTop: 12,
    fontSize: 14,
  },
});
