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
        <Link style={styles.title} href={"/adoptDogList"}>
          Dogs
        </Link>
      </View>
      <View style={styles.adpotionMenuContainer}>
        <Image
          style={styles.adoptionPanelMenuImage}
          source={require("../assets//images/CatImage.png")}
        >
          <Link href={"/index"}></Link>
        </Image>
        <Link style={styles.title} href={"/adoptCatList"}>
          Cats
        </Link>
      </View>
      <View style={styles.adpotionMenuContainer}>
        <Image
          style={styles.adoptionPanelMenuImage}
          source={require("../assets//images/RabbitImage.png")}
        >
          <Link href={"/index"}></Link>
        </Image>
        <Link style={styles.title} href={"/adoptOtherAnimalList"}>
          Other animals
        </Link>
      </View>
    </View>
  );
}
