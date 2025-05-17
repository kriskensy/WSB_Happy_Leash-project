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

  const handleDelete = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(
        `http://10.0.2.2:5000/api/HealthRecord/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        Alert.alert("Success", "Health record deleted", [
          { text: "OK", onPress: () => router.push("/health-records") },
        ]);
      } else {
        Alert.alert("Error", "Deletion failed");
      }
    } catch (error) {
      console.error("Error deleting health record:", error);
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this health record?",
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

  const toggleVaccinationStatus = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(
        `http://10.0.2.2:5000/api/HealthRecord/${id}/vaccination`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: !healthRecord.vaccinationStatus }),
        }
      );

      if (response.ok) {
        setHealthRecord((prev) => ({
          ...prev,
          vaccinationStatus: !prev.vaccinationStatus,
        }));
      } else {
        Alert.alert("Error", "Failed to update vaccination status");
      }
    } catch (error) {
      console.error("Error updating vaccination:", error);
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
        <AdminHeader title="Health Record Details" />

        <View style={styles.card}>
          <Text style={styles.detailLabel}>ID:</Text>
          <Text style={styles.detailValue}>{healthRecord.id}</Text>

          <Text style={styles.detailLabel}>Pet:</Text>
          <Text style={styles.detailValue}>{healthRecord.petName}</Text>

          <Text style={styles.detailLabel}>Vet:</Text>
          <Text style={styles.detailValue}>{healthRecord.vetName}</Text>

          <Text style={styles.detailLabel}>Date:</Text>
          <Text style={styles.detailValue}>
            {formatDate(healthRecord.recordDate)}
          </Text>

          <Text style={styles.detailLabel}>Description:</Text>
          <Text style={styles.detailValue}>
            {healthRecord.description || "No description"}
          </Text>

          <Text style={styles.detailLabel}>Vaccination Status:</Text>
          <Text
            style={[
              styles.detailValue,
              {
                color: healthRecord.vaccinationStatus
                  ? COLORS.success
                  : COLORS.warning,
              },
            ]}
          >
            {healthRecord.vaccinationStatus ? "Completed" : "Pending"}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: healthRecord.vaccinationStatus
                ? COLORS.warning
                : COLORS.success,
            },
          ]}
          onPress={toggleVaccinationStatus}
        >
          <Text style={styles.buttonText}>
            {healthRecord.vaccinationStatus
              ? "Mark as Not Vaccinated"
              : "Mark as Vaccinated"}
          </Text>
        </TouchableOpacity>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, { flex: 1, marginRight: 5 }]}
            onPress={() => router.push(`/health-records/edit/${id}`)}
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
          onPress={() => router.push("/health-records")}
        >
          <Text style={styles.buttonText}>Back to List</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
