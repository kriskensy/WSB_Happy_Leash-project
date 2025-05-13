import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "../assets/styles/main.styles";
import { Image } from "expo-image";
import { Link } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

export default function mainMenu() {
  const [token, setToken] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isUser, setIsUser] = useState(false);

  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await AsyncStorage.getItem("userToken");
      setToken(storedToken);

      if (storedToken) {
        try {
          const decoded = jwtDecode(storedToken);
          console.log("Decoded JWT:", decoded);
          if (decoded?.role === "Admin") {
            setIsAdmin(true);
          } else if (decoded?.role === "User") {
            setIsUser(true);
          }
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
        <Text style={styles.title}>do usunięcia!!!!!!!!! </Text>
        <Text style={styles.title}>Info z tokenu: </Text>
        <Text style={styles.title}>Czy admin: {isAdmin ? "TAK" : "NIE"}</Text>
        <Text style={styles.title}>Czy user: {isUser ? "TAK" : "NIE"}</Text>
      </View>

      <View style={styles.topIllustration}>
        <Image
          source={require("../assets//images/MainMenuImage.png")}
          style={styles.illustrationImage}
        />
      </View>
      <Text style={styles.label}>
        Let's make a better house for the animals together!
      </Text>
      <View style={styles.button}>
        <Link
          style={[styles.homeViewButtonsText, styles.buttonText]}
          href={"/adoptionPanelMenu"}
        >
          Adoption Panel
        </Link>
      </View>
      <View style={styles.button}>
        <Link
          style={[styles.homeViewButtonsText, styles.buttonText]}
          href={"/(auth)/register"}
        >
          Education
        </Link>
      </View>
      <View style={styles.button}>
        <Link
          style={[styles.homeViewButtonsText, styles.buttonText]}
          href={"/aboutTeam"}
        >
          About our team
        </Link>
      </View>
      {isAdmin && (
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Admin Panel</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
