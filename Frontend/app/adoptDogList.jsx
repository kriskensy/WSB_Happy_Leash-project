import { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import styles from "../assets/styles/main.styles";
import { Image } from "expo-image";

export default function AdoptDogList() {
  const [allDogs, setAllDogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from the API
  const fetchDogs = async () => {
    try {
      const response = await fetch("http://10.0.2.2:5000/api/Pet/type/1"); // 1 = psy
      const data = await response.json();
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
    <View style={styles.petContainer}>
      <Image style={styles.petImage} source={{ uri: item.pictureURL }} />
      <Text style={styles.subtitle}>{item.name}</Text>
    </View>
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
