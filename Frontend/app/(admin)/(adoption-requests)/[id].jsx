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
import styles from "../../../assets/styles/main.styles";
import adminStyles from "../../../assets/styles/admin.styles";
import AdminHeader from "../(components)/AdminHeader";
import COLORS from "../../../constants/colors";

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

  const handleDelete = async () => {
    try {
      setLoading(true);
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
        Alert.alert("Success", "Adoption request deleted successfully", [
          { text: "OK", onPress: () => router.push("/adoption-requests") },
        ]);
      } else {
        Alert.alert("Error", "Failed to delete adoption request");
      }
    } catch (error) {
      console.error("Error deleting adoption request:", error);
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this adoption request?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: handleDelete, style: "destructive" },
      ]
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const handleApproveReject = async (isApproved) => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(
        `http://10.0.2.2:5000/api/AdoptionRequest/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ isApproved }),
        }
      );

      if (response.ok) {
        const statusText = isApproved ? "approved" : "rejected";
        Alert.alert("Success", `Adoption request ${statusText} successfully`);
        fetchAdoptionRequest(); // Refresh the data
      } else {
        Alert.alert("Error", "Failed to update adoption request status");
      }
    } catch (error) {
      console.error("Error updating adoption request status:", error);
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <AdminHeader title="Adoption Request Details" />

        <View style={styles.card}>
          <Text style={styles.detailLabel}>ID:</Text>
          <Text style={styles.detailValue}>{adoptionRequest.id}</Text>

          <Text style={styles.detailLabel}>Pet:</Text>
          <Text style={styles.detailValue}>{adoptionRequest.petName}</Text>

          <Text style={styles.detailLabel}>User:</Text>
          <Text
            style={styles.detailValue}
          >{`${adoptionRequest.userFirstName} ${adoptionRequest.userLastName}`}</Text>

          <Text style={styles.detailLabel}>Message:</Text>
          <Text style={styles.detailValue}>
            {adoptionRequest.message || "No message provided"}
          </Text>

          <Text style={styles.detailLabel}>Request Date:</Text>
          <Text style={styles.detailValue}>
            {formatDate(adoptionRequest.requestDate)}
          </Text>

          <Text style={styles.detailLabel}>Status:</Text>
          <Text
            style={[
              styles.detailValue,
              {
                color: adoptionRequest.isApproved
                  ? COLORS.success
                  : COLORS.warning,
              },
            ]}
          >
            {adoptionRequest.isApproved ? "Approved" : "Pending"}
          </Text>
        </View>

        {!adoptionRequest.isApproved && (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: COLORS.success }]}
            onPress={() => handleApproveReject(true)}
          >
            <Text style={styles.buttonText}>Approve Request</Text>
          </TouchableOpacity>
        )}

        {adoptionRequest.isApproved && (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: COLORS.warning }]}
            onPress={() => handleApproveReject(false)}
          >
            <Text style={styles.buttonText}>Mark as Pending</Text>
          </TouchableOpacity>
        )}

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, { flex: 1, marginRight: 5 }]}
            onPress={() => router.push(`/adoption-requests/edit/${id}`)}
          >
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              { flex: 1, marginLeft: 5, backgroundColor: COLORS.danger },
            ]}
            onPress={confirmDelete}
          >
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: COLORS.secondary, marginTop: 10 },
          ]}
          onPress={() => router.push("/adoption-requests")}
        >
          <Text style={styles.buttonText}>Back to List</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
