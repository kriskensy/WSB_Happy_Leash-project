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
import adminStyles from "../../../assets/styles/admin.styles";
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

  const handleRedirectToEdit = async (id) => {
    try {
      router.push(`/(admin)/(pets)/edit/${id}`);
    } catch (error) {
      console.error("Error details:", error);
      Alert.alert("Error!", error.message || "Unknown error.");
    }
  };

  const handleRedirect = async () => {
    try {
      router.push("/(admin)/(pets)/create");
    } catch (error) {
      console.error("Error details:", error);
      Alert.alert("Error!", error.message || "Unknown error.");
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
      <View style={adminStyles.loaderContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={adminStyles.container}>
      <AdminHeader title="Pets" showBack={false} />

      <TouchableOpacity
        style={adminStyles.mainButton}
        onPress={() => handleRedirect()}
        accessibilityLabel="Add new pet"
        accessibilityRole="button"
      >
        <Text style={adminStyles.mainButtonText}>Add New Pet</Text>
      </TouchableOpacity>

      <FlatList
        data={pets}
        keyExtractor={(item) => item.id.toString()}
        style={adminStyles.list}
        renderItem={({ item }) => {
          return (
            <View style={{ marginBottom: 20 }}>
              <ListItem
                title={item.name}
                subtitle={[
                  `Type: ${item.petTypeName}`,
                  `Breed: ${item.breedName}`,
                  `Adopted: ${item.adopted ? "Yes" : "No"}`,
                ]}
                onPress={() => router.push(`/(pets)/${item.id}`)}
                onEdit={() => handleRedirectToEdit(item.id)}
                onDelete={() => confirmDelete(item.id, item.name)}
                leftImage={
                  item.pictureURL && (
                    <Image
                      source={{ uri: `http://10.0.2.2:5000${item.pictureURL}` }}
                      style={{ width: 50, height: 50, borderRadius: 8 }}
                    />
                  )
                }
              />
            </View>
          );
        }}
        ListEmptyComponent={
          <Text style={adminStyles.emptyListText}>No pets found</Text>
        }
      />

      <TouchableOpacity
        style={adminStyles.mainButton}
        onPress={() => router.push("../adminMenu")}
        accessibilityLabel="Back to admin menu"
        accessibilityRole="button"
      >
        <Text style={adminStyles.mainButtonText}>Back to Admin Menu</Text>
      </TouchableOpacity>
    </View>
  );
}
