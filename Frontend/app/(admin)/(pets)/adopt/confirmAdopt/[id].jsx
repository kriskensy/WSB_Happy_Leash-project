import { useEffect, useState } from "react";
import {
  View,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  ScrollView,
  Image,
  Text,
  TextInput,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import adminStyles from "../../../../../assets/styles/admin.styles";
import AdminHeader from "../../../(components)/AdminHeader";
import COLORS from "../../../../../constants/colors";
import DetailRow from "../../../../../components/DetailRow";

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

  const handleAdoption = async (id) => {
    try {
      const token = await AsyncStorage.getItem("userToken");

      const formData = new FormData();
      formData.append("PetId", id);

      const response = await fetch(`http://10.0.2.2:5000/api/Pet/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) fetchPets();
      else Alert.alert("Error", "Failed to adopt pet");
    } catch (error) {
      console.error("Error details:", error);
      Alert.alert("Error!", error.message || "Unknown error.");
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
      <AdminHeader title="Tell us more about you" />
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
        <DetailRow label="Why we should give you " value={pet.name} />
        <TextInput
          name="adoptionReason"
          placeholder="Write your reason here"
          multiline={true}
          numberOfLines={10}
          style={{
            height: 200,
            textAlignVertical: "top",
            borderColor: COLORS.primary,
            borderWidth: 1,
            backgroundColor: COLORS.white,
          }}
        />
      </View>
      <TouchableOpacity
        style={[adminStyles.mainButton, { marginTop: 16 }]}
        onPress={() => handleAdoption}
      >
        <Text style={adminStyles.mainButtonText}>Send Adoption Request</Text>
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
