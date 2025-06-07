import { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import styles from "../assets/styles/main.styles";
import { Image } from "expo-image";
import AdoptListItem from "./(admin)/(components)/AdoptlistItem";
import { useRouter } from "expo-router";

export default function AdoptOtherAnimalList() {
  const [allAnimals, setAllAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch other animals (e.g. rabbits, snakes)
  const fetchOtherAnimals = async () => {
    try {
      const response = await fetch("http://10.0.2.2:5000/api/Pet/type/2?adopted=false"); // 2 = inne zwierzęta
      const data = await response.json();
      setAllAnimals(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching other animals:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOtherAnimals();
  }, []);

  const renderItem = ({ item }) => (
    <AdoptListItem
      petName={item.name}
      image={`http://10.0.2.2:5000${item.pictureURL}`}
      onPress={() =>
        router.push({ pathname: "/(pets)/adopt/[id]", params: { id: item.id } })
      }
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Other Animals</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={allAnimals}
          renderItem={renderItem}
          keyExtractor={(animal) => animal.id.toString()}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
