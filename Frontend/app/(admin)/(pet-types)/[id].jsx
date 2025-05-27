import { useEffect, useState } from "react";
import {
  View,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  ScrollView,
  Text,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import adminStyles from "../../../assets/styles/admin.styles";
import AdminHeader from "../(components)/AdminHeader";
import COLORS from "../../../constants/colors";
import DetailRow from '../../../components/DetailRow';

export default function PetTypeDetails() {
  const { id } = useLocalSearchParams();
  const [petType, setPetType] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchPetType();
  }, [id]);

  const fetchPetType = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(`http://10.0.2.2:5000/api/PetType/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPetType(data);
      } else {
        Alert.alert("Error", "Failed to load pet type details");
        router.back();
      }
    } catch (error) {
      console.error("Error fetching pet type:", error);
      Alert.alert("Error", "An unexpected error occurred");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  if (loading || !petType) {
    return (
      <View style={[adminStyles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={adminStyles.container}>
      <AdminHeader title="Pet Type Details" />
      <View style={adminStyles.card}>
        <DetailRow label="ID" value={petType.id} />
        <DetailRow label="Name" value={petType.name} />
      </View>
      <TouchableOpacity
        style={[adminStyles.mainButton, { marginTop: 16 }]}
        onPress={() => router.push("/(admin)/(pet-types)")}
      >
        <Text style={adminStyles.mainButtonText}>Back to List</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
