import { useEffect, useState } from "react";
import {
  View,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  ScrollView,
  Image,
  Text,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import adminStyles from "../../../assets/styles/admin.styles";
import AdminHeader from "../(components)/AdminHeader";
import COLORS from "../../../constants/colors";
import { formatDate } from "../../../utils/dateUtils";
import DetailRow from '../../../components/DetailRow';

export default function UserDetails() {
  const { id } = useLocalSearchParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(`http://10.0.2.2:5000/api/User/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) setUser(await response.json());
      else {
        Alert.alert("Error", "Failed to load user details");
        router.back();
      }
    } catch {
      Alert.alert("Error", "An unexpected error occurred");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  if (loading || !user) {
    return (
      <View style={[adminStyles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={adminStyles.container}>
      <AdminHeader title="User Details" />
      {user.profilePictureURL ? (
        <Image
          source={{ uri: user.profilePictureURL }}
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            marginBottom: 10,
            alignSelf: "center",
          }}
        />
      ) : null}
      <View style={adminStyles.card}>
        <DetailRow label="First Name" value={user.firstName} />
        <DetailRow label="Last Name" value={user.lastName} />
        <DetailRow label="Email" value={user.email} />
        <DetailRow label="Login" value={user.login} />
        <DetailRow label="User Type" value={user.userType} />
        <DetailRow label="Created At" value={formatDate(user.createdAt)} />
        <DetailRow label="Address" value={user.address || "-"} />
        <DetailRow label="City" value={user.city || "-"} />
        <DetailRow label="Country" value={user.country || "-"} />
        <DetailRow label="Phone Number" value={user.phoneNumber || "-"} />
        <DetailRow label="Postal Code" value={user.postalCode || "-"} />
      </View>
      <TouchableOpacity
        style={[adminStyles.mainButton, { marginTop: 16 }]}
        onPress={() => router.push("/(admin)/(users)")}
      >
        <Text style={adminStyles.mainButtonText}>Back to List</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}