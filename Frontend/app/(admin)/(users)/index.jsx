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
import { formatDate } from "../../../utils/dateUtils";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch("http://10.0.2.2:5000/api/auth/users", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) setUsers(await response.json());
      else Alert.alert("Error", "Failed to load users");
    } catch {
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleRedirect = async () => {
    try {
      router.push("/(admin)/(users)/create");
    } catch (error) {
      console.error("Error details:", error);
      Alert.alert("Error!", error.message || "Unknown error.");
    }
  };

  const handleRedirectToEdit = async (id) => {
    try {
      router.push(`/(admin)/(users)/edit/${id}`);
    } catch (error) {
      console.error("Error details:", error);
      Alert.alert("Error!", error.message || "Unknown error.");
    }
  };
  const handleDeleteUser = async (id) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(`http://10.0.2.2:5000/api/User/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) fetchUsers();
      else Alert.alert("Error", "Failed to delete user");
    } catch {
      Alert.alert("Error", "An unexpected error occurred");
    }
  };

  const confirmDelete = (id, userName) => {
    Alert.alert("Confirm Delete", `Delete user "${userName}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: () => handleDeleteUser(id),
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
      <AdminHeader title="Users" showBack={false}/>

      <TouchableOpacity
        style={adminStyles.mainButton}
        onPress={() => handleRedirect()}
        accessibilityLabel="Add new user"
        accessibilityRole="button"
      >
        <Text style={adminStyles.mainButtonText}>Add New User</Text>
      </TouchableOpacity>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        style={adminStyles.list}
        renderItem={({ item }) => (
          <ListItem
            title={item.name}
            subtitle={[
              `Firstname: ${item.firstName}`,
              `Lastname: ${item.lastName}`,
              //TODO te pola wykomentowane bo mają być widoczne na widokach szczegółowych
              // `Email: ${item.email}`,
              // `Created at: ${formatDate(item.createdAt)}`,
              // `User type: ${item.userType}`,
              // `Address: ${item.address}`,
              // `City: ${item.city}`,
              // `Country: ${item.country}`,
              // `Login: ${item.login}`,
              // `Phone number: ${item.phoneNumber}`,
              // `Postal code: ${item.postalCode}`,
              `Profile picture url: ${item.profilePictureURL}`,

            ]}
            onPress={() => router.push(`/(users)/${item.id}`)}
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
