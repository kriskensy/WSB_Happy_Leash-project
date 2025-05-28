import { useEffect, useState } from "react";
import {
  View,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  ScrollView,
  Text,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import adminStyles from "../../../assets/styles/admin.styles";
import AdminHeader from "../(components)/AdminHeader";
import COLORS from "../../../constants/colors";
import { formatDate } from "../../../utils/dateUtils";
import DetailRow from '../../../components/DetailRow';

export default function TagDetails() {
  const { id } = useLocalSearchParams();
  const [tag, setTag] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchTag();
  }, [id]);

  const fetchTag = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(`http://10.0.2.2:5000/api/Tag/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTag(data);
      } else {
        Alert.alert("Error", "Failed to load tag details");
        router.back();
      }
    } catch (error) {
      console.error("Error fetching tag:", error);
      Alert.alert("Error", "An unexpected error occurred");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  if (loading || !tag) {
    return (
      <View style={[adminStyles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={adminStyles.container}>
      <AdminHeader title="Tag Details" />
      <View style={adminStyles.card}>
        <DetailRow label="ID" value={tag.id} />
        <DetailRow label="Name" value={tag.name} />
        <DetailRow
          label="Pets"
          value={
            tag.pets && tag.pets.length > 0
              ? tag.pets.map(p => p.name).join(", ")
              : "-"
          }
        />
      </View>
      <TouchableOpacity
        style={[adminStyles.mainButton, { marginTop: 16 }]}
        onPress={() => router.push("/(admin)/(tags)")}
      >
        <Text style={adminStyles.mainButtonText}>Back to List</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
