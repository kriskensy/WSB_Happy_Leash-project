import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../../../assets/styles/main.styles";
import adminStyles from "../../../assets/styles/admin.styles";
import AdminHeader from "../(components)/AdminHeader";
import COLORS from "../../../constants/colors";

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

  const handleDelete = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(`http://10.0.2.2:5000/api/PetTag/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        Alert.alert("Success", "Pet tag deleted", [
          { text: "OK", onPress: () => router.push("/pet-tags") },
        ]);
      } else {
        Alert.alert("Error", "Failed to delete");
      }
    } catch {
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      "Confirm Delete",
      `Delete tag "${petTag?.tagName}" from pet "${petTag?.petName}"?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: handleDelete, style: "destructive" },
      ]
    );
  };

  if (loading || !petTag) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AdminHeader title="Pet Tag Details" />
      <View style={styles.card}>
        <Text style={styles.detailLabel}>ID:</Text>
        <Text style={styles.detailValue}>{petTag.id}</Text>
        <Text style={styles.detailLabel}>Pet:</Text>
        <Text style={styles.detailValue}>{petTag.petName}</Text>
        <Text style={styles.detailLabel}>Tag:</Text>
        <Text style={styles.detailValue}>{petTag.tagName}</Text>
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, { flex: 1, marginRight: 5 }]}
          onPress={() => router.push(`/pet-tags/edit/${id}`)}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            { flex: 1, marginLeft: 5, backgroundColor: COLORS.danger },
          ]}
          onPress={confirmDelete}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: COLORS.secondary, marginTop: 10 },
        ]}
        onPress={() => router.push("/pet-tags")}
      >
        <Text style={styles.buttonText}>Back to List</Text>
      </TouchableOpacity>
    </View>
  );
}
