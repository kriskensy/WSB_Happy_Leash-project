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
import AsyncStorage from "@react-native-async-storage/async-storage";
import AdoptListItem from "./(admin)/(components)/AdoptlistItem";

export default function AdoptCatList() {
  const [allCats, setAllCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Przenosi do szczegółów zwierzaka
  const handlePetDetails = (id) => {
    router.push({ pathname: "/petDetails", params: { petId: id } });
  };

  const fetchCats = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch("http://10.0.2.2:5000/api/Pet/type/3", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const text = await response.text();
      if (!text) {
        setAllCats([]);
        setLoading(false);
        return;
      }
      const data = JSON.parse(text);
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
    <AdoptListItem
      petName={item.name}
      image={`http://10.0.2.2:5000${item.pictureURL}`}
      onPress={() => router.push(`/(pets)/${item.id}`)}
    />
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
