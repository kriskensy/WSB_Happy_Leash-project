import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import adminStyles from "../../../../assets/styles/admin.styles";
import AdminHeader from "../../(components)/AdminHeader";
import FormField from "../../(components)/FormField";
import COLORS from "../../../../constants/colors";

export default function EditPetType() {
  const { id } = useLocalSearchParams();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
        setName(data.name);
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

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Name is required");
      return;
    }

    try {
      setSaving(true);
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(`http://10.0.2.2:5000/api/PetType/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, name }),
      });

      if (response.ok) {
        Alert.alert("Success", "Pet type updated successfully", [
          { text: "OK", onPress: () => router.push(`/(admin)/(pet-types)/`) },
        ]);
      } else {
        const errorData = await response.json();
        Alert.alert("Error", errorData.message || "Failed to update pet type");
      }
    } catch (error) {
      console.error("Error updating pet type:", error);
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={[adminStyles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={adminStyles.container}>
      <AdminHeader title="Edit Pet Type" />

      <FormField
        label="Name"
        value={name}
        onChangeText={setName}
        placeholder="Enter pet type name"
        iconName="paw-outline"
      />

      <TouchableOpacity
        style={adminStyles.mainButton}
        onPress={handleSubmit}
        disabled={saving}
        accessibilityLabel="Update pet type"
      >
        {saving ? (
          <ActivityIndicator size="small" color={COLORS.white} />
        ) : (
          <Text style={adminStyles.mainButtonText}>Update Pet Type</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[adminStyles.mainButton, { marginTop: 10 }]}
        onPress={() => router.push(`/(admin)/(pet-types)`)}
        disabled={saving}
        accessibilityLabel="Cancel"
      >
        <Text style={adminStyles.mainButtonText}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
