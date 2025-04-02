import { View, Text } from "react-native";
import styles from "../assets/styles/main.styles";
import { Image } from "expo-image";
import { Link } from "expo-router";

export default function adoptionPanel() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Adoption Panel</Text>
      <View style={styles.adpotionMenuContainer}>
        <Image
          style={styles.adoptionPanelMenuImage}
          source={require("../assets//images/DogImage.png")}
        >
          <Link href={"/index"}></Link>
        </Image>
        <Text style={styles.title}>Dogs</Text>
      </View>
      <View style={styles.adpotionMenuContainer}>
        <Image
          style={styles.adoptionPanelMenuImage}
          source={require("../assets//images/CatImage.png")}
        >
          <Link href={"/index"}></Link>
        </Image>
        <Text style={styles.title}>Cats</Text>
      </View>
      <View style={styles.adpotionMenuContainer}>
        <Image
          style={styles.adoptionPanelMenuImage}
          source={require("../assets//images/RabbitImage.png")}
        >
          <Link href={"/index"}></Link>
        </Image>
        <Text style={styles.title}>Other animals</Text>
      </View>
    </View>
  );
}
