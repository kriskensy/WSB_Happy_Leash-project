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

export default function PetTagDetails() {
  const { id } = useLocalSearchParams();
  const [petTag, setPetTag] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchPetTag();
  }, [id]);

  const fetchPetTag = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(`http://10.0.2.2:5000/api/PetTag/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        setPetTag(await response.json());
      } else {
        Alert.alert("Error", "Failed to load details");
        router.back();
      }
    } catch {
      Alert.alert("Error", "An unexpected error occurred");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  if (loading || !petTag) {
    return (
      <View style={[adminStyles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={adminStyles.container}>
      <AdminHeader title="Pet Tag Details" />
      <View style={adminStyles.card}>
        <DetailRow label="ID" value={petTag.id} />
        <DetailRow label="Pet" value={petTag.petName} />
        <DetailRow label="Tag" value={petTag.tagName} />
      </View>
      <TouchableOpacity
        style={[adminStyles.mainButton, { marginTop: 16 }]}
        onPress={() => router.push("/(admin)/(pet-tags)")}
      >
        <Text style={adminStyles.mainButtonText}>Back to List</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
