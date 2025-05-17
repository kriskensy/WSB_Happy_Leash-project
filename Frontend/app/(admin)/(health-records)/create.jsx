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
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import styles from "../../../assets/styles/main.styles";
import adminStyles from "../../../assets/styles/admin.styles";
import modalStyles from "../../../assets/styles/modal.styles";
import AdminHeader from "../(components)/AdminHeader";
import FormField from "../(components)/FormField";
import COLORS from "../../../constants/colors";

export default function CreateHealthRecord() {
  const [petId, setPetId] = useState("");
  const [recordDate, setRecordDate] = useState(new Date());
  const [description, setDescription] = useState("");
  const [vetName, setVetName] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [pets, setPets] = useState([]);
  const [showPetModal, setShowPetModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchPets = async () => {
      try {
        setFetchingData(true);
        const token = await AsyncStorage.getItem("userToken");
        const petsResponse = await fetch("http://10.0.2.2:5000/api/Pet", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (petsResponse.ok) {
          const petsData = await petsResponse.json();
          setPets(petsData);
          if (petsData.length > 0) setPetId(petsData[0].id);
        } else {
          Alert.alert("Error", "Failed to load pets");
        }
      } catch (error) {
        console.error("Error fetching pets:", error);
        Alert.alert("Error", "An unexpected error occurred");
      } finally {
        setFetchingData(false);
      }
    };
    fetchPets();
  }, []);

  const handleDateConfirm = (date) => {
    setRecordDate(date);
    setShowDatePicker(false);
  };

  const handleSubmit = async () => {

//petId w ten sposób aby również Id = 0 było poprawnie obsłużone
    if (
      petId === null ||
      petId === undefined || 
      petId === "" || 
      !recordDate || 
      !description.trim() || 
      !vetName.trim()) {
      Alert.alert("Error", "All fields are required");
      return;
    }
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch("http://10.0.2.2:5000/api/HealthRecord", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          petId,
          recordDate: recordDate.toISOString(),
          description,
          vetName,
        }),
      });

      if (response.ok) {
        Alert.alert("Success", "Health record created successfully", [
          { text: "OK", onPress: () => router.push("/(admin)/(health-records)") },
        ]);
      } else {
        const errorData = await response.json();
        Alert.alert("Error", errorData.message || "Creation failed");
      }
    } catch (error) {
      console.error("Error creating health record:", error);
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getPetName = (id) => {
    const pet = pets.find((p) => p.id === id);
    return pet ? pet.name : "Select Pet";
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
        <AdminHeader title="Create Health Record" />

        <Text style={styles.pickerLabel}>Pet:</Text>
        <TouchableOpacity
          style={styles.pickerContainer}
          onPress={() => setShowPetModal(true)}
          accessibilityLabel="Select pet"
          accessible
        >
          <Text>{getPetName(petId)}</Text>
        </TouchableOpacity>
        <Modal
          visible={showPetModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowPetModal(false)}
        >
          <View style={modalStyles.modalOverlay}>
            <View style={modalStyles.modalContent}>
              <FlatList
                data={pets}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => {
                      setPetId(item.id);
                      setShowPetModal(false);
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
                onPress={() => setShowPetModal(false)}
                style={modalStyles.modalCloseButton}
                accessibilityLabel="Close pet selection"
                accessible
              >
                <Text style={{ color: COLORS.primary }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Text style={styles.pickerLabel}>Record Date:</Text>
        <TouchableOpacity
          style={styles.dateInput}
          onPress={() => setShowDatePicker(true)}
          accessibilityLabel="Select record date"
          accessible
        >
          <Text>{recordDate.toLocaleDateString()}</Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={showDatePicker}
          mode="date"
          date={recordDate}
          onConfirm={handleDateConfirm}
          onCancel={() => setShowDatePicker(false)}
          display={Platform.OS === "ios" ? "inline" : "default"}
        />

        <FormField
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="Enter health record details"
          iconName="document-text-outline"
          multiline={true}
          numberOfLines={4}
        />

        <FormField
          label="Vet Name"
          value={vetName}
          onChangeText={setVetName}
          placeholder="Enter vet name"
          iconName="person-outline"
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={loading}
          accessibilityLabel="Create health record"
          accessible
        >
          {loading ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <Text style={styles.buttonText}>Create Health Record</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={adminStyles.mainButton}
          onPress={() => router.push("/(admin)/(health-records)")}
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
