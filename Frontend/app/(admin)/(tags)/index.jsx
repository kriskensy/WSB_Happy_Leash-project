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

export default function TagList() {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch("http://10.0.2.2:5000/api/Tag", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTags(data);
      } else {
        Alert.alert("Error", "Failed to load tags");
      }
    } catch (error) {
      console.error("Error fetching tags:", error);
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleRedirect = async () => {
    try {
      router.push("/(admin)/(tags)/create");
    } catch (error) {
      console.error("Error details:", error);
      Alert.alert("Error!", error.message || "Unknown error.");
    }
  };

  const handleRedirectToEdit = async (id) => {
    try {
      router.push(`/(admin)/(tags)/edit/${id}`);
    } catch (error) {
      console.error("Error details:", error);
      Alert.alert("Error!", error.message || "Unknown error.");
    }
  };
  const handleDeleteTag = async (id) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(`http://10.0.2.2:5000/api/Tag/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        Alert.alert("Success", "Tag deleted successfully");
        fetchTags();
      } else {
        Alert.alert("Error", "Failed to delete tag");
      }
    } catch (error) {
      console.error("Error deleting tag:", error);
      Alert.alert("Error", "An unexpected error occurred");
    }
  };

  const confirmDelete = (id, tagName) => {
    Alert.alert(
      "Confirm Delete",
      `Are you sure you want to delete "${tagName}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: () => handleDeleteTag(id),
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
      <AdminHeader title="Tags" showBack={false} />

      <TouchableOpacity
        style={adminStyles.mainButton}
        onPress={() => handleRedirect()}
        accessibilityLabel="Add new tag"
        accessibilityRole="button"
      >
        <Text style={adminStyles.mainButtonText}>Add New Tag</Text>
      </TouchableOpacity>

      <FlatList
        data={tags}
        keyExtractor={(item) => item.id.toString()}
        style={adminStyles.list}
        renderItem={({ item }) => (
          <ListItem
            title={item.name}
            subtitle={[
              `Tag: ${item.name}`
            ]}
            onPress={() => router.push(`/(tags)/${item.id}`)}
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
