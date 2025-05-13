import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "../assets/styles/main.styles";
import { Image } from "expo-image";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "expo-router";

export default function AdminMenu() {
  const [token, setToken] = useState(null);
  const [fristName, setFristName] = useState(false);
  const [lastName, setLastName] = useState(false);
  const router = useRouter();

  const handleMoveToPetListPanel = () => {
    router.push("/petListPanel");
  };

  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await AsyncStorage.getItem("userToken");
      setToken(storedToken);

      if (storedToken) {
        try {
          const decoded = jwtDecode(storedToken);
          setFristName(decoded.firstName);
          setLastName(decoded.lastName);
        } catch (error) {
          console.log("Błąd dekodowania tokena:", error);
        }
      }
    };

    loadToken();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.topIllustration}>
        <Text style={styles.title}>
          Welcome {fristName} {lastName}!
        </Text>
        <Image
          source={require("../assets//images/AdminPanelImage.png")}
          style={styles.illustrationImage}
        />

        <Text style={styles.title}>What we gona do today?</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleMoveToPetListPanel}
      >
        <Text style={styles.buttonText}>Admin Panel</Text>
      </TouchableOpacity>
    </View>
  );
}
