import { useEffect, useState } from "react";
import {
  View,
  ActivityIndicator,
  Alert,
  ScrollView,
  TouchableOpacity,
  Text,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import adminStyles from "../../../assets/styles/admin.styles";
import AdminHeader from "../(components)/AdminHeader";
import COLORS from "../../../constants/colors";
import DetailRow from '../../../components/DetailRow';
import PetTypeDetails from "../(pet-types)/[id]";

export default function BreedDetails() {
  const { id } = useLocalSearchParams();
  const [breed, setBreed] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchBreed();
  }, [id]);

  const fetchBreed = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(`http://10.0.2.2:5000/api/Breed/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBreed(data);
      } else {
        Alert.alert("Error", "Failed to load breed details");
        router.back();
      }
    } catch (error) {
      console.error("Error fetching breed:", error);
      Alert.alert("Error", "An unexpected error occurred");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[adminStyles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!breed) {
    return null;
  }

  return (
    <ScrollView style={adminStyles.container}>
      <AdminHeader title="Breed Details" />
      <View style={adminStyles.card}>
        <DetailRow label="ID" value={breed.id} />
        <DetailRow label="Name" value={breed.name} />
        <DetailRow label="Pet Type" value={breed.petTypeName|| "-"} />
      </View>
      <TouchableOpacity
        style={[adminStyles.mainButton, { marginTop: 16 }]}
        onPress={() => router.push("/(admin)/(breeds)")}
      >
        <Text style={adminStyles.mainButtonText}>Back to List</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
