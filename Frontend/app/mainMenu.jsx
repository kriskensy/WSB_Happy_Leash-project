import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "../assets/styles/main.styles";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

export default function MainMenu() {
  const [token, setToken] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const router = useRouter();

  const handleNavigate = (path) => {
    router.push({ pathname: path });
  };

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
        <Image
          source={require("../assets/images/MainMenuImage.png")}
          style={styles.illustrationImage}
        />
      </View>

      <Text style={styles.label}>
        Let's make a better house for the animals together!
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => handleNavigate("/adoptionPanelMenu")}
      >
        <Text style={styles.buttonText}>Adoption Panel</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => handleNavigate("/(auth)/register")}
      >
        <Text style={styles.buttonText}>Education</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => handleNavigate("/aboutTeam")}
      >
        <Text style={styles.buttonText}>About our team</Text>
      </TouchableOpacity>

      {isUser && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleNavigate("/(auth)/editProfile")}
        >
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>
      )}

      {isAdmin && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleNavigate("/adminMenu")}
        >
          <Text style={styles.buttonText}>Admin Panel</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
