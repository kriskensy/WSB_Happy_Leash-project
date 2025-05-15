import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import styles from "../../../assets/styles/main.styles";
import AdminHeader from "../(components)/AdminHeader";
import ListItem from "../(components)/ListItem";
import COLORS from "../../../constants/colors";

export default function PetList() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch("http://10.0.2.2:5000/api/Pet", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) setPets(await response.json());
      else Alert.alert("Error", "Failed to load pets");
    } catch {
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePet = async (id) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(`http://10.0.2.2:5000/api/Pet/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) fetchPets();
      else Alert.alert("Error", "Failed to delete pet");
    } catch {
      Alert.alert("Error", "An unexpected error occurred");
    }
  };

  const confirmDelete = (id, petName) => {
    Alert.alert("Confirm Delete", `Delete pet "${petName}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: () => handleDeletePet(id),
        style: "destructive",
      },
    ]);
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
      <AdminHeader title="Pets" showBack={false} />
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/pets/create")}
      >
        <Text style={styles.buttonText}>Add New Pet</Text>
      </TouchableOpacity>
      <FlatList
        data={pets}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.listItemWithActions}>
            <ListItem
              title={item.name}
              subtitle={`Type: ${item.petTypeName} | Breed: ${
                item.breedName
              } | Adopted: ${item.adopted ? "Yes" : "No"}`}
              onPress={() => router.push(`/pets/${item.id}`)}
              leftElement={
                item.imageUrl && (
                  <Image
                    source={{ uri: item.imageUrl }}
                    style={{ width: 48, height: 48, borderRadius: 24 }}
                  />
                )
              }
            />
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => router.push(`/pets/edit/${item.id}`)}
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
          <Text style={styles.emptyListText}>No pets found</Text>
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
