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

export default function EditTag() {
  const { id } = useLocalSearchParams();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchTag = async () => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem("userToken");
        const response = await fetch(`http://10.0.2.2:5000/api/Tag/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setName(data.name);
        } else {
          Alert.alert("Error", "Failed to load tag details");
          router.back();
        }
      } catch (error) {
        console.error("Error fetching tag:", error);
        Alert.alert("Error", "An unexpected error occurred");
        router.back();
      } finally {
        setLoading(false);
      }
    };

    fetchTag();
  }, [id]);

  const handleSubmit = async () => {
    if (!name) {
      Alert.alert("Error", "Tag name is required");
      return;
    }

    try {
      setSaving(true);
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(`http://10.0.2.2:5000/api/Tag/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id,
          name,
        }),
      });

      if (response.ok) {
        Alert.alert("Success", "Tag updated successfully", [
          { text: "OK", onPress: () => router.push(`/(tags)/${id}`) },
        ]);
      } else {
        const errorData = await response.json();
        Alert.alert("Error", errorData.message || "Failed to update tag");
      }
    } catch (error) {
      console.error("Error updating tag:", error);
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
      <AdminHeader title="Edit Tag" />

      <FormField
        label="Tag Name"
        value={name}
        onChangeText={setName}
        placeholder="Enter tag name"
        iconName="pricetag-outline"
      />

      <TouchableOpacity
        style={adminStyles.mainButton}
        onPress={handleSubmit}
        disabled={saving}
        accessibilityLabel="Update tag"
      >
        {saving ? (
          <ActivityIndicator size="small" color={COLORS.white} />
        ) : (
          <Text style={adminStyles.mainButtonText}>Update Tag</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[adminStyles.mainButton, { marginTop: 10 }]}
        onPress={() => router.push(`/(admin)/(tags)`)}
        disabled={saving}
        accessibilityLabel="Cancel"
      >
        <Text style={adminStyles.mainButtonText}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
