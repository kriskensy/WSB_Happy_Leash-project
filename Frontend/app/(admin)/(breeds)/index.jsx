import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import styles from "../../../assets/styles/main.styles";
import AdminHeader from "../(components)/AdminHeader";
import ListItem from "../(components)/ListItem";
import COLORS from "../../../constants/colors";

export default function BreedList() {
  const [breeds, setBreeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchBreeds();
  }, []);

  const fetchBreeds = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch("http://10.0.2.2:5000/api/Breed", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBreeds(data);
      } else {
        Alert.alert("Error", "Failed to load breeds");
      }
    } catch (error) {
      console.error("Error fetching breeds:", error);
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBreed = async (id) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(`http://10.0.2.2:5000/api/Breed/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        Alert.alert("Success", "Breed deleted successfully");
        fetchBreeds(); // Refresh the list
      } else {
        Alert.alert("Error", "Failed to delete breed");
      }
    } catch (error) {
      console.error("Error deleting breed:", error);
      Alert.alert("Error", "An unexpected error occurred");
    }
  };

  const confirmDelete = (id, breedName) => {
    Alert.alert(
      "Confirm Delete",
      `Are you sure you want to delete "${breedName}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: () => handleDeleteBreed(id),
          style: "destructive",
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AdminHeader title="Breeds" showBack={false} />

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/breeds/create")}
      >
        <Text style={styles.buttonText}>Add New Breed</Text>
      </TouchableOpacity>

      <FlatList
        data={breeds}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.listItemWithActions}>
            <ListItem
              title={item.name}
              subtitle={`Type: ${item.petTypeName}`}
              onPress={() => router.push(`/breeds/${item.id}`)}
            />
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => router.push(`/breeds/edit/${item.id}`)}
              >
                <Ionicons name="pencil" size={20} color={COLORS.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => confirmDelete(item.id, item.name)}
              >
                <Ionicons name="trash" size={20} color={COLORS.danger} />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyListText}>No breeds found</Text>
        }
      />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: COLORS.secondary }]}
        onPress={() => router.push("/admin-menu")}
      >
        <Text style={styles.buttonText}>Back to Admin Menu</Text>
      </TouchableOpacity>
    </View>
  );
}
