import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import adminStyles from "../../../assets/styles/admin.styles";
import AdminHeader from "../(components)/AdminHeader";
import COLORS from "../../../constants/colors";
import { formatDate } from "../../../utils/dateUtils";
import DetailRow from '../../../components/DetailRow';

export default function AdoptionRequestDetails() {
  const { id } = useLocalSearchParams();
  const [adoptionRequest, setAdoptionRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchAdoptionRequest();
  }, [id]);

  const fetchAdoptionRequest = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(
        `http://10.0.2.2:5000/api/AdoptionRequest/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAdoptionRequest(data);
      } else {
        Alert.alert("Error", "Failed to load adoption request details");
        router.back();
      }
    } catch (error) {
      console.error("Error fetching adoption request:", error);
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

  if (!adoptionRequest) {
    return null;
  }

  return (
  <ScrollView style={adminStyles.container}>
      <AdminHeader title="Adoption Request Details" />
      <View style={adminStyles.card}>
        <DetailRow label="ID" value={adoptionRequest.id} />
        <DetailRow label="Pet" value={adoptionRequest.petName || "-"} />
        <DetailRow
          label="User"
          value={
            adoptionRequest.userFirstName && adoptionRequest.userLastName
              ? `${adoptionRequest.userFirstName} ${adoptionRequest.userLastName}`
              : adoptionRequest.userName || "-"
          }
        />
        <DetailRow label="Message" value={adoptionRequest.message || "No message provided"} />
        <DetailRow label="Request Date" value={formatDate(adoptionRequest.requestDate)} />
        <DetailRow
          label="Status"
          value={adoptionRequest.isApproved ? "Approved" : "Pending"}
          valueStyle={{
            color: adoptionRequest.isApproved ? COLORS.success : COLORS.warning,
          }}
        />
      </View>
      <TouchableOpacity
        style={[adminStyles.mainButton, { marginTop: 16 }]}
        onPress={() => router.push("/(admin)/(adoption-requests)")}
      >
        <Text style={adminStyles.mainButtonText}>Back to List</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}