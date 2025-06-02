import { useEffect, useState } from "react";
import {
  View,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  ScrollView,
  Image,
  Text,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import adminStyles from "../../../../assets/styles/admin.styles";
import AdminHeader from "../../(components)/AdminHeader";
import COLORS from "../../../../constants/colors";
import DetailRow from "../../../../components/DetailRow";

export default function Adopt() {
  const { id } = useLocalSearchParams();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchPet();
  }, [id]);

  const fetchPet = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(`http://10.0.2.2:5000/api/Pet/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) setPet(await response.json());
      else {
        Alert.alert("Error", "Failed to load pet details");
        router.back();
      }
    } catch {
      Alert.alert("Error", "An unexpected error occurred");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  if (loading || !pet) {
    return (
      <View style={[adminStyles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={adminStyles.container}>
      <AdminHeader title="Pet Details" />
      {pet.pictureURL ? (
        <Image
          source={{
            uri: pet.pictureURL.startsWith("file://")
              ? pet.pictureURL
              : `http://10.0.2.2:5000${pet.pictureURL}`,
          }}
          style={{
            width: 200,
            height: 200,
            borderRadius: 20,
            marginBottom: 10,
            alignSelf: "center",
          }}
        />
      ) : null}
      <View style={adminStyles.card}>
        <DetailRow label="Name" value={pet.name} />
        <DetailRow label="Type" value={pet.petTypeName} />
        <DetailRow label="Breed" value={pet.breedName} />
        <DetailRow label="Age" value={pet.age} />
        <DetailRow label="Weight" value={pet.weight} />
        <DetailRow label="Gender" value={pet.genderName} />
        <DetailRow label="Notes" value={pet.notes} />
        <DetailRow label="Adopted" value={pet.adopted ? "Yes" : "No"} />
        <DetailRow
          label="Tags"
          value={
            pet.tags && pet.tags.length > 0
              ? pet.tags.map((t) => t.name).join(", ")
              : "-"
          }
        />
      </View>
      <TouchableOpacity
        style={[adminStyles.mainButton, { marginTop: 16 }]}
        onPress={() => router.push("Nieznane")} //TODO: Zamienić na stronę adopcji
      >
        <Text style={adminStyles.mainButtonText}>Adopt Me!!!</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[adminStyles.mainButton, { marginTop: 16 }]}
        onPress={() => router.push("/adoptionPanelMenu")}
      >
        <Text style={adminStyles.mainButtonText}>Back to List</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
