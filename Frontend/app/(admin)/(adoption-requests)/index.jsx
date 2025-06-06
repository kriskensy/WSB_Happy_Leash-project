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
import ListItem from "../(components)/ListItem";
import COLORS from "../../../constants/colors";
import { formatDate } from "../../../utils/dateUtils";

export default function AdoptionRequestList() {
  const [adoptionRequests, setAdoptionRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchAdoptionRequests();
  }, []);

  const fetchAdoptionRequests = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch("http://10.0.2.2:5000/api/AdoptionRequest", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAdoptionRequests(data);
      } else {
        Alert.alert("Error", "Failed to load adoption requests");
      }
    } catch (error) {
      console.error("Error fetching adoption requests:", error);
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleRedirect = async () => {
    try {
      router.push("/(admin)/(adoption-requests)/create");
    } catch (error) {
      console.error("Error details:", error);
      Alert.alert("Error!", error.message || "Unknown error.");
    }
  };

  const handleRedirectToEdit = async (id) => {
    try {
      router.push(`/(admin)/(adoption-requests)/edit/${id}`);
    } catch (error) {
      console.error("Error details:", error);
      Alert.alert("Error!", error.message || "Unknown error.");
    }
  };
  
  const handleDeleteAdoptionRequest = async (id) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(
        `http://10.0.2.2:5000/api/AdoptionRequest/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        Alert.alert("Success", "Adoption request deleted successfully");
        fetchAdoptionRequests();
      } else {
        Alert.alert("Error", "Failed to delete adoption request");
      }
    } catch (error) {
      console.error("Error deleting adoption request:", error);
      Alert.alert("Error", "An unexpected error occurred");
    }
  };

  const confirmDelete = (id, petName, userName) => {
    Alert.alert(
      "Confirm Delete",
      `Are you sure you want to delete the adoption request for "${petName}" by "${userName}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: () => handleDeleteAdoptionRequest(id),
          style: "destructive",
        },
      ]
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
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
      <AdminHeader title="Adoption Requests" showBack={false} />

      <TouchableOpacity
        style={adminStyles.mainButton}
        onPress={() => handleRedirect()}
        accessibilityLabel="Add new adoption request"
        accessibilityRole="button"
      >
        <Text style={adminStyles.mainButtonText}>Add New Adoption Request</Text>
      </TouchableOpacity>
      <FlatList
        data={adoptionRequests}
        keyExtractor={(item) => item.id.toString()}
        style={adminStyles.list}
        renderItem={({ item }) => (
          <ListItem
            title={item.name}
            subtitle={[
              `Pet: ${item.petName}`,
              `User: ${item.userName}`,
              `Message: ${item.message}`,
              `Request date: ${formatDate(item.requestDate)}`,
              `Approved?: ${item.isApproved ? "Yes" : "No"}`              
            ]}
            onPress={() => router.push(`/(adoption-requests)/${item.id}`)}
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
          <Text style={adminStyles.emptyListText}>No adoption requests found</Text>
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
