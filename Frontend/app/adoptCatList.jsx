import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import styles from "../assets/styles/main.styles";
import { Image } from "expo-image";
import { useRouter } from "expo-router";

export default function AdoptCatList() {
  const [allCats, setAllCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Przenosi do szczegółów zwierzaka
  const handlePetDetails = (id) => {
    router.push({ pathname: "/petDetails", params: { petId: id } });
  };

  // Pobiera koty z API
  const fetchCats = async () => {
    try {
      const response = await fetch("http://10.0.2.2:5000/api/pet/type/3"); // 3 = koty
      const data = await response.json();
      setAllCats(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching pets:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCats();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.petContainer}>
      <Image style={styles.petImage} source={{ uri: item.pictureURL }} />
      <Text style={styles.subtitle}>{item.name}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handlePetDetails(item.id)}
      >
        <Text style={styles.buttonText}>More Info About ME!</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Our Cats</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={allCats}
          renderItem={renderItem}
          keyExtractor={(cat) => cat.id.toString()}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
