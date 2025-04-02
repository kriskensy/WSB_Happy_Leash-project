import { View, Text, FlatList } from "react-native";
import styles from "../assets/styles/main.styles";
import { Image } from "expo-image";
import { Link } from "expo-router";

export default function adoptDogList() {
  const allDogs = [
    {
      id: 0,
      petName: "Szczekuś",
      image: require("../assets/images/pets/dog1.jpg"),
    },
    {
      id: 1,
      petName: "Gryzak",
      image: require("../assets/images/pets/dog2.jpg"),
    },
    {
      id: 2,
      petName: "Szczekuś",
      image: require("../assets/images/pets/dog1.jpg"),
    },
    {
      id: 3,
      petName: "Gryzak",
      image: require("../assets/images/pets/dog2.jpg"),
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
      <Text style={styles.header}>Ours Dogs</Text>
      <View style={styles.adpotionMenuContainer}>
        <FlatList
          data={allDogs}
          renderItem={renderItem}
          keyExtractor={(dog) => dog.id.toString()}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}
