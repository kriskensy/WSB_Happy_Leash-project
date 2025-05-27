import { useEffect, useState } from "react";
import {
  View,
  ActivityIndicator,
  Alert,
  ScrollView,
  TouchableOpacity,
  Text,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import adminStyles from "../../../assets/styles/admin.styles";
import AdminHeader from "../(components)/AdminHeader";
import COLORS from "../../../constants/colors";
import { formatDate } from "../../../utils/dateUtils";
import DetailRow from '../../../components/DetailRow';

export default function HealthRecordDetails() {
  const { id } = useLocalSearchParams();
  const [healthRecord, setHealthRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchHealthRecord();
  }, [id]);

  const fetchHealthRecord = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(
        `http://10.0.2.2:5000/api/HealthRecord/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setHealthRecord(data);
      } else {
        Alert.alert("Error", "Failed to load health record");
        router.back();
      }
    } catch (error) {
      console.error("Error fetching health record:", error);
      Alert.alert("Error", "An unexpected error occurred");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[adminStyles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!healthRecord) {
    return null;
  }

  return (
    <ScrollView style={adminStyles.container}>
      <AdminHeader title="Health Record Details" />
      <View style={adminStyles.card}>
        <DetailRow label="ID" value={healthRecord.id} />
        <DetailRow label="Pet" value={healthRecord.petName || "-"} />
        <DetailRow label="Vet" value={healthRecord.vetName || "-"} />
        <DetailRow label="Date" value={formatDate(healthRecord.recordDate)} />
        <DetailRow label="Description" value={healthRecord.description || "No description"} />
      </View>
      <TouchableOpacity
        style={[adminStyles.mainButton, { marginTop: 16 }]}
        onPress={() => router.push("/(admin)/(health-records)")}
      >
        <Text style={adminStyles.mainButtonText}>Back to List</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
