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

export default function PetTypeList() {
  const [petTypes, setPetTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchPetTypes();
  }, []);

  const fetchPetTypes = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch("http://10.0.2.2:5000/api/PetType", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPetTypes(data);
      } else {
        Alert.alert("Error", "Failed to load pet types");
      }
    } catch (error) {
      console.error("Error fetching pet types:", error);
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePetType = async (id) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const url = "http://10.0.2.2:5000/api/PetType";

      //TODO tylko logi wstawione
      console.log("Token:", token);
      console.log("Requesting (DELETE):", url);

      const response = await fetch(`http://10.0.2.2:5000/api/PetType/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        Alert.alert("Success", "Pet type deleted successfully");
        fetchPetTypes(); // Refresh the list
      } else {
        Alert.alert("Error", "Failed to delete pet type");
      }
    } catch (error) {
      console.error("Error deleting pet type:", error);
      Alert.alert("Error", "An unexpected error occurred");
    }
  };

  const confirmDelete = (id, name) => {
    Alert.alert(
      "Confirm Delete",
      `Are you sure you want to delete "${name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: () => handleDeletePetType(id),
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
      <AdminHeader title="Pet Types" showBack={false} />

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/pet-types/create")}
      >
        <Text style={styles.buttonText}>Add New Pet Type</Text>
      </TouchableOpacity>

      <FlatList
        data={petTypes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.listItemWithActions}>
            <ListItem
              title={item.name}
              onPress={() => router.push(`/pet-types/${item.id}`)}
            />
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => router.push(`/pet-types/edit/${item.id}`)}
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
          <Text style={styles.emptyListText}>No pet types found</Text>
        }
      />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: COLORS.secondary }]}
        onPress={() => router.push("/adminMenu")}
      >
        <Text style={styles.buttonText}>Back to Admin Menu</Text>
      </TouchableOpacity>
    </View>
  );
}
