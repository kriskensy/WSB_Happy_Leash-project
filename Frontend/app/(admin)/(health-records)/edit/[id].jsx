import { useEffect, useState } from "react";
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
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import adminStyles from "../../../../assets/styles/admin.styles";
import modalStyles from "../../../../assets/styles/modal.styles";
import AdminHeader from "../../(components)/AdminHeader";
import FormField from "../../(components)/FormField";
import COLORS from "../../../../constants/colors";

export default function EditHealthRecord() {
  const { id } = useLocalSearchParams();
  const [petId, setPetId] = useState("");
  const [vetName, setVetName] = useState("");
  const [recordDate, setRecordDate] = useState(new Date());
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pets, setPets] = useState([]);
  const [showPetModal, setShowPetModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem("userToken");

        const petsResponse = await fetch("http://10.0.2.2:5000/api/Pet", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const recordResponse = await fetch(
          `http://10.0.2.2:5000/api/HealthRecord/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (petsResponse.ok && recordResponse.ok) {
          const petsData = await petsResponse.json();
          const recordData = await recordResponse.json();

          setPets(petsData);
          setPetId(String(recordData.petId));
          setVetName(recordData.vetName || "");
          setRecordDate(new Date(recordData.recordDate));
          setDescription(recordData.description || "");
        } else {
          Alert.alert("Error", "Failed to load data");
          router.back();
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        Alert.alert("Error", "An unexpected error occurred");
        router.back();
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleDateConfirm = (date) => {
    setRecordDate(date);
    setShowDatePicker(false);
  };

  const handleSubmit = async () => {
    if (!petId || !vetName.trim() || !recordDate || !description.trim()) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    try {
      setSaving(true);
      const token = await AsyncStorage.getItem("userToken");

      const response = await fetch(
        `http://10.0.2.2:5000/api/HealthRecord/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id: Number(id),
            petId: Number(petId),
            vetName,
            recordDate: recordDate.toISOString(),
            description,
          }),
        }
      );

      if (response.ok) {
        Alert.alert("Success", "Health record updated", [
          {
            text: "OK",
            onPress: () => router.push("/(admin)/(health-records)"),
          },
        ]);
      } else {
        const errorData = await response.json();
        Alert.alert("Error", errorData.message || "Update failed");
      }
    } catch (error) {
      console.error("Error updating health record:", error);
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  };

  const getPetName = (id) => {
    const pet = pets.find((p) => String(p.id) === String(id));
    return pet ? pet.name : "Select Pet";
  };

  if (loading) {
    return (
      <View style={[adminStyles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={adminStyles.container}>
      <AdminHeader title="Edit Health Record" />

      <Text style={adminStyles.pickerLabel}>Pet:</Text>
      <TouchableOpacity
        style={adminStyles.pickerContainer}
        onPress={() => setShowPetModal(true)}
        accessibilityLabel="Select pet"
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
                    setPetId(String(item.id));
                    setShowPetModal(false);
                  }}
                  style={modalStyles.modalItem}
                  accessibilityLabel={`Select ${item.name}`}
                >
                  <Text>{item.name}</Text>
                </Pressable>
              )}
            />
            <TouchableOpacity
              onPress={() => setShowPetModal(false)}
              style={modalStyles.modalCloseButton}
              accessibilityLabel="Close pet selection"
            >
              <Text style={{ color: COLORS.primary }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Text style={adminStyles.pickerLabel}>Record Date:</Text>
      <TouchableOpacity
        style={adminStyles.pickerContainer}
        onPress={() => setShowDatePicker(true)}
        accessibilityLabel="Select record date"
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
        label="Vet Name"
        value={vetName}
        onChangeText={setVetName}
        placeholder="Enter vet name"
        iconName="person-outline"
      />

      <FormField
        label="Description"
        value={description}
        onChangeText={setDescription}
        placeholder="Enter health record description"
        iconName="document-text-outline"
        multiline={true}
        numberOfLines={4}
      />

      <TouchableOpacity
        style={adminStyles.mainButton}
        onPress={handleSubmit}
        disabled={saving}
        accessibilityLabel="Update health record"
      >
        {saving ? (
          <ActivityIndicator size="small" color={COLORS.white} />
        ) : (
          <Text style={adminStyles.mainButtonText}>Update Health Record</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[adminStyles.mainButton, { marginTop: 10 }]}
        onPress={() => router.push("/(admin)/(health-records)")}
        disabled={saving}
        accessibilityLabel="Cancel"
      >
        <Text style={adminStyles.mainButtonText}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
