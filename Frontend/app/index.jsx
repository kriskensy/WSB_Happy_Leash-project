import { View, TouchableOpacity } from "react-native";
import styles from "../assets/styles/login.styles";
import { Image } from "expo-image";
import { Link } from "expo-router";

export default function Index() {
  return (
    <View style={styles.container}>
      <View style={styles.topIllustration}>
        <Image
          source={require("../assets/images/WelcomePageMainImage.png")}
          style={styles.illustrationImage}
        />
      </View>
      <Link
        style={[styles.button, styles.homeViewButtonsText, styles.buttonText]}
        href={"/(auth)"}
      >
        Login
      </Link>
      <Link
        style={[styles.button, styles.homeViewButtonsText, styles.buttonText]}
        href={"/(auth)/register"}
      >
        Register
      </Link>
    </View>
  );
}
