import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import styles from "../assets/styles/main.styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function LogoutButton() {
  const router = useRouter();
  const handleRedirect = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");

      if (!token) {
        Alert.alert("Error!", "No token found. Please log in again.");
        return;
      }

      const response = await fetch(`http://10.0.2.2:5000/api/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json(); // <-- potrzebne do odczytu danych!

      if (!response.ok) {
        Alert.alert("Error!", data.message || "Something went wrong.");
        return;
      }

      await AsyncStorage.removeItem("userToken");
      Alert.alert("Success", data.message || "Logged out.");

      router.replace("/login");
    } catch (error) {
      console.error("Error details:", error);
      Alert.alert("Error!", error.message || "Unknown error.");
    }
  };

  return (
    <TouchableOpacity
      onPress={handleRedirect}
      style={[
        styles.button,
        {
          height: 40,
          width: 120,
          alignSelf: "center",
          marginTop: 40,
          borderRadius: 10,
        },
      ]}
    >
      <Text style={styles.buttonText}>Log Out</Text>
    </TouchableOpacity>
  );
}
