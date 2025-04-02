import { View, Text, FlatList } from "react-native";
import styles from "../assets/styles/main.styles";
import { Image } from "expo-image";
import { Link } from "expo-router";

export default function adoptOtherAnimalList() {
  const allAnimals = [
    {
      id: 0,
      petName: "Kicek",
      image: require("../assets/images/pets/rabbit1.jpg"),
    },
    {
      id: 1,
      petName: "Kręty",
      image: require("../assets/images/pets/snake1.jpg"),
    },
    {
      id: 2,
      petName: "Kicek",
      image: require("../assets/images/pets/rabbit1.jpg"),
    },
    {
      id: 3,
      petName: "Kręty",
      image: require("../assets/images/pets/snake1.jpg"),
    },
  ];
  const renderItem = ({ item }) => (
    <View>
      <Image style={styles.petImage} source={item.image} />
      <Text style={styles.subtitle}>{item.petName}</Text>
    </View>
  );
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Ours Other Animals</Text>
      <View style={styles.adpotionMenuContainer}>
        <FlatList
          data={allAnimals}
          renderItem={renderItem}
          keyExtractor={(animal) => animal.id.toString()}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}
