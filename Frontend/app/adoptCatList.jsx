import { View, Text, FlatList } from "react-native";
import styles from "../assets/styles/main.styles";
import { Image } from "expo-image";
import { Link } from "expo-router";

export default function adoptCatList() {
  const allCats = [
    {
      id: 0,
      petName: "Miałczek",
      image: require("../assets/images/pets/cat1.jpg"),
    },
    {
      id: 1,
      petName: "Tuliś",
      image: require("../assets/images/pets/cat2.jpg"),
    },
    {
      id: 2,
      petName: "Miałczek",
      image: require("../assets/images/pets/cat1.jpg"),
    },
    {
      id: 3,
      petName: "Tuliś",
      image: require("../assets/images/pets/cat2.jpg"),
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
      <Text style={styles.header}>Ours Cats</Text>
      <View style={styles.adpotionMenuContainer}>
        <FlatList
          data={allCats}
          renderItem={renderItem}
          keyExtractor={(cat) => cat.id.toString()}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}
