import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../../../assets/styles/main.styles";
import adminStyles from "../../../assets/styles/admin.styles";
import AdminHeader from "../(components)/AdminHeader";
import COLORS from "../../../constants/colors";

export default function PetDetails() {
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

  const handleDelete = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(`http://10.0.2.2:5000/api/Pet/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        Alert.alert("Success", "Pet deleted", [
          { text: "OK", onPress: () => router.push("/pets") },
        ]);
      } else {
        Alert.alert("Error", "Failed to delete pet");
      }
    } catch {
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = () => {
    Alert.alert("Confirm Delete", `Delete pet "${pet?.name}"?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", onPress: handleDelete, style: "destructive" },
    ]);
  };

  if (loading || !pet) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <AdminHeader title="Pet Details" />
        {pet.imageUrl ? (
          <Image
            source={{ uri: pet.imageUrl }}
            style={{
              width: 150,
              height: 150,
              borderRadius: 12,
              marginBottom: 10,
            }}
          />
        ) : null}
        <View style={styles.card}>
          <Text style={styles.detailLabel}>Name:</Text>
          <Text style={styles.detailValue}>{pet.name}</Text>
          <Text style={styles.detailLabel}>Type:</Text>
          <Text style={styles.detailValue}>{pet.petTypeName}</Text>
          <Text style={styles.detailLabel}>Breed:</Text>
          <Text style={styles.detailValue}>{pet.breedName}</Text>
          <Text style={styles.detailLabel}>Age:</Text>
          <Text style={styles.detailValue}>{pet.age}</Text>
          <Text style={styles.detailLabel}>Description:</Text>
          <Text style={styles.detailValue}>
            {pet.description || "No description"}
          </Text>
          <Text style={styles.detailLabel}>Adopted:</Text>
          <Text style={styles.detailValue}>{pet.adopted ? "Yes" : "No"}</Text>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, { flex: 1, marginRight: 5 }]}
            onPress={() => router.push(`/pets/edit/${id}`)}
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
          onPress={() => router.push("/pets")}
        >
          <Text style={styles.buttonText}>Back to List</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
