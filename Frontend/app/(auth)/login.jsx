import { Alert, View, Text, TextInput, TouchableOpacity } from "react-native";
import styles from "../../assets/styles/main.styles";
import { useState } from "react";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleLogin = async () => {
    if (!login || !password) {
      Alert.alert("Błąd", "Wprowadź login i hasło.");
      return;
    }

    try {
      const formData = new URLSearchParams();
      formData.append("login", login);
      formData.append("password", password);

      const response = await fetch("http://10.0.2.2:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Błąd logowania", data.message || "Nieznany błąd.");
        return;
      }

      // Save the token in session storage
      await AsyncStorage.setItem("userToken", data.userToken);

      Alert.alert("Sukces", data.message);
      router.push("../mainMenu");
    } catch (error) {
      Alert.alert("Błąd", error.message || "Nieznany błąd.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topIllustration}>
        <Image
          source={require("../../assets/images/LoginImage.png")}
          style={styles.illustrationImage}
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Login</Text>
        <View style={styles.inputContainer}>
          <Ionicons
            name="mail-outline"
            size={20}
            color={COLORS.primary}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter your login"
            placeholderTextColor={COLORS.placeholderText}
            value={login}
            onChangeText={setLogin}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <View style={styles.inputContainer}>
          <Ionicons
            name="lock-closed-outline"
            size={20}
            color={COLORS.primary}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor={COLORS.placeholderText}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={showPassword ? "eye-outline" : "eye-off-outline"}
              size={20}
              color={COLORS.primary}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
