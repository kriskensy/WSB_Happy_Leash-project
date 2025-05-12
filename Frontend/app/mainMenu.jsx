import { View, Text } from "react-native";
import styles from "../assets/styles/main.styles";
import { Image } from "expo-image";
import { Link } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function mainMenu() {
  const dataFromSession = AsyncStorage.getItem("userToken");
  return (
    <View style={styles.container}>
      <View style={styles.topIllustration}>
        <Text style={styles.title}>do usunięcia!!!!!!!!! </Text>
        <Text style={styles.title}>Wygenerowany token: </Text>
        <Text style={styles.title}>{dataFromSession}</Text>
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
    </View>
  );
}
