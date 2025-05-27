import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  Modal,
  FlatList,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../../../assets/styles/main.styles";
import adminStyles from "../../../assets/styles/admin.styles";
import modalStyles from "../../../assets/styles/modal.styles";
import AdminHeader from "../(components)/AdminHeader";
import FormField from "../(components)/FormField";
import COLORS from "../../../constants/colors";

export default function CreateBreed() {
  const [name, setName] = useState("");
  const [typeId, setTypeId] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [petTypes, setPetTypes] = useState([]);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchPetTypes = async () => {
      try {
        setFetchingData(true);
        const token = await AsyncStorage.getItem("userToken");
        const response = await fetch("http://10.0.2.2:5000/api/PetType", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setPetTypes(data);
          if (data.length > 0) setTypeId(data[0].id);
        } else {
          const errorText = await response.text();
          console.log("Error fetching pet types:", response.status, errorText);
          Alert.alert("Error", "Failed to load pet types");
        }
      } catch (error) {
        console.error("Error fetching pet types:", error);
        Alert.alert("Error", "An unexpected error occurred");
      } finally {
        setFetchingData(false);
      }
    };

    fetchPetTypes();
  }, []);

  const handleSubmit = async () => {
    if (!name || !typeId) {
      Alert.alert("Error", "Name and Pet Type are required");
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch("http://10.0.2.2:5000/api/Breed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, petTypeId: typeId }),
      });
      const data = await response.json();
      console.log(data);

      if (response.ok) {
        Alert.alert("Success", "Breed created successfully", [
          { text: "OK", onPress: () => router.push("/(admin)/(breeds)") },
        ]);
      } else {
        const errorText = await response.text();
        try {
          const errorData = JSON.parse(errorText);
          Alert.alert("Error", errorData.message || "Failed to create breed");
        } catch {
          Alert.alert("Error", errorText || "Failed to create breed");
        }
      }
    } catch (error) {
      console.error("Error creating breed:", error);
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getTypeName = (id) => {
    const type = petTypes.find((t) => t.id === id);
    return type ? type.name : "Select Pet Type";
  };

  if (fetchingData) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <AdminHeader title="Create Breed" />

        <FormField
          label="Breed Name"
          value={name}
          onChangeText={setName}
          placeholder="Enter breed name"
          iconName="paw-outline"
        />

        <Text style={styles.pickerLabel}>Pet Type:</Text>
        <TouchableOpacity
          style={styles.pickerContainer}
          onPress={() => setShowTypeModal(true)}
          accessibilityLabel="Select pet type"
          accessible
        >
          <Text>{getTypeName(typeId)}</Text>
        </TouchableOpacity>

        <Modal
          visible={showTypeModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowTypeModal(false)}
        >
          <View style={modalStyles.modalOverlay}>
            <View style={modalStyles.modalContent}>
              <FlatList
                data={petTypes}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => {
                      setTypeId(item.id);
                      setShowTypeModal(false);
                    }}
                    style={modalStyles.modalItem}
                    accessibilityLabel={`Select ${item.name}`}
                    accessible
                  >
                    <Text>{item.name}</Text>
                  </Pressable>
                )}
              />
              <TouchableOpacity
                onPress={() => setShowTypeModal(false)}
                style={modalStyles.modalCloseButton}
                accessibilityLabel="Close pet type selection"
                accessible
              >
                <Text style={{ color: COLORS.primary }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={loading}
          accessibilityLabel="Create breed"
          accessible
        >
          {loading ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <Text style={styles.buttonText}>Create Breed</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={adminStyles.mainButton}
          onPress={() => router.push("/(admin)/(breeds)")}
          disabled={loading}
          accessibilityLabel="Cancel"
          accessible
        >
          <Text style={adminStyles.mainButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
