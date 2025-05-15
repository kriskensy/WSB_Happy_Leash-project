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
      const response = await fetch("http://10.0.2.2:5000/api/User", {
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
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AdminHeader title="Users" showBack={false} />
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/users/create")}
      >
        <Text style={styles.buttonText}>Add New User</Text>
      </TouchableOpacity>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.listItemWithActions}>
            <ListItem
              title={`${item.firstName} ${item.lastName}`}
              subtitle={`Email: ${item.email} | Login: ${item.login} | Type: ${item.userType}`}
              onPress={() => router.push(`/users/${item.id}`)}
              leftElement={
                item.profilePictureURL && (
                  <Image
                    source={{ uri: item.profilePictureURL }}
                    style={{ width: 48, height: 48, borderRadius: 24 }}
                  />
                )
              }
            />
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => router.push(`/users/edit/${item.id}`)}
              >
                <Ionicons name="pencil" size={20} color={COLORS.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() =>
                  confirmDelete(item.id, `${item.firstName} ${item.lastName}`)
                }
              >
                <Ionicons name="trash" size={20} color={COLORS.danger} />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyListText}>No users found</Text>
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
