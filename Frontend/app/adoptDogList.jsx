import { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import styles from "../assets/styles/main.styles";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import AdoptListItem from "./(admin)/(components)/AdoptlistItem";

export default function AdoptDogList() {
  const [allDogs, setAllDogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch data from the API
  const fetchDogs = async () => {
    try {
      const response = await fetch("http://10.0.2.2:5000/api/Pet/type/5"); // 5 = psy
      const data = await response.json();

      console.log("Odpowiedź z API:", data);
      setAllDogs(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching pets:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDogs();
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
      <Text style={styles.header}>Our Dogs</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={allDogs}
          renderItem={renderItem}
          keyExtractor={(dog) => dog.id.toString()}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
