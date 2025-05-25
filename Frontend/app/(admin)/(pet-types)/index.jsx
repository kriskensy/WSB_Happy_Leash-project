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
import adminStyles from "../../../assets/styles/admin.styles";
import AdminHeader from "../(components)/AdminHeader";
import COLORS from "../../../constants/colors";
import ListItem from "../(components)/ListItem";

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
      const response = await fetch(`${url}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        Alert.alert("Success", "Pet type deleted successfully");
        fetchPetTypes();
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
  //********************************************************************************** */
  const handleRedirect = async () => {
    try {
      router.push("/(admin)/(pet-types)/create");
    } catch (error) {
      console.error("Error details:", error);
      Alert.alert("Error!", error.message || "Unknown error.");
    }
  };
  //********************************************************************************** */

  const handleRedirectToEdit = async (id) => {
    try {
      router.push(`/(admin)/(pet-types)/edit/${id}`);
    } catch (error) {
      console.error("Error details:", error);
      Alert.alert("Error!", error.message || "Unknown error.");
    }
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
      <AdminHeader title="Pet Types" showBack={false} />

      <TouchableOpacity
        style={adminStyles.mainButton}
        onPress={() => handleRedirect()}
        accessibilityLabel="Add new pet type"
        accessibilityRole="button"
      >
        <Text style={adminStyles.mainButtonText}>Add New Pet Type</Text>
      </TouchableOpacity>

      {/* <FlatList
        data={petTypes}
        keyExtractor={(item) => item.id.toString()}
        style={adminStyles.list}
        renderItem={({ item }) => (
          <View style={adminStyles.listItemWithActions}>
            <Text
              style={adminStyles.listItemTitle}
              accessibilityLabel={item.name}
            >
              {item.name}
            </Text>
            <View style={adminStyles.actionButtons}>
              <TouchableOpacity
                style={adminStyles.actionButton}
                onPress={() => handleRedirectToEdit(item.id)}
                accessibilityLabel={`Edit ${item.name}`}
                accessibilityRole="button"
              >
                <Ionicons name="pencil" size={20} color={COLORS.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={adminStyles.actionButton}
                onPress={() => confirmDelete(item.id, item.name)}
                accessibilityLabel={`Delete ${item.name}`}
                accessibilityRole="button"
              >
                <Ionicons name="trash" size={20} color={COLORS.danger} />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={adminStyles.emptyListText}>No pet types found</Text>
        }
      /> */}
      <FlatList
        data={petTypes}
        keyExtractor={(item) => item.id.toString()}
        style={adminStyles.list}
        renderItem={({ item }) => (
          <ListItem
            title={item.name}
            subtitle={[
              `Pet type: ${item.name}`
            ]}
            onPress={() => router.push(`/(pet-types)/${item.id}`)}
            onEdit={() => handleRedirectToEdit(item.id)}
            onDelete={() => confirmDelete(item.id, item.name)}
            //dodatkowo jeśli np byłoby jakieś foto dla rekordu
            leftElement={
              item.imageUrl && (
                <Image
                  source={{ uri: item.imageUrl }}
                  style={{ width: 48, height: 48, borderRadius: 24 }}
                />
              )
            }
          />
        )}
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
