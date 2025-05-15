import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Picker } from "@react-native-picker/picker";
// import DateTimePicker from "@react-native-community/datetimepicker";
import styles from "../../../../assets/styles/main.styles";
import AdminHeader from "../../(components)/AdminHeader";
import FormField from "../../(components)/FormField";
import COLORS from "../../../../constants/colors";

export default function EditHealthRecord() {
  const { id } = useLocalSearchParams();
  const [petId, setPetId] = useState("");
  const [vetId, setVetId] = useState("");
  const [recordDate, setRecordDate] = useState(new Date());
  const [description, setDescription] = useState("");
  const [vaccinationStatus, setVaccinationStatus] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pets, setPets] = useState([]);
  const [vets, setVets] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem("userToken");

        const petsResponse = await fetch("http://10.0.2.2:5000/api/Pet", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const vetsResponse = await fetch("http://10.0.2.2:5000/api/User/vets", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const recordResponse = await fetch(
          `http://10.0.2.2:5000/api/HealthRecord/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (petsResponse.ok && vetsResponse.ok && recordResponse.ok) {
          const petsData = await petsResponse.json();
          const vetsData = await vetsResponse.json();
          const recordData = await recordResponse.json();

          setPets(petsData);
          setVets(vetsData);
          setPetId(recordData.petId);
          setVetId(recordData.vetId);
          setRecordDate(new Date(recordData.recordDate));
          setDescription(recordData.description);
          setVaccinationStatus(recordData.vaccinationStatus);
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

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setRecordDate(selectedDate);
    }
  };

  const handleSubmit = async () => {
    if (!petId || !vetId) {
      Alert.alert("Error", "Pet and Vet are required");
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
            petId,
            vetId,
            recordDate: recordDate.toISOString(),
            description,
            vaccinationStatus,
          }),
        }
      );

      if (response.ok) {
        Alert.alert("Success", "Health record updated", [
          { text: "OK", onPress: () => router.push(`/health-records/${id}`) },
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
        <AdminHeader title="Edit Health Record" />

        <Text style={styles.pickerLabel}>Pet:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={petId}
            onValueChange={setPetId}
            style={styles.picker}
          >
            {pets.map((pet) => (
              <Picker.Item key={pet.id} label={pet.name} value={pet.id} />
            ))}
          </Picker>
        </View>

        <Text style={styles.pickerLabel}>Vet:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={vetId}
            onValueChange={setVetId}
            style={styles.picker}
          >
            {vets.map((vet) => (
              <Picker.Item
                key={vet.id}
                label={`${vet.firstName} ${vet.lastName}`}
                value={vet.id}
              />
            ))}
          </Picker>
        </View>

        <Text style={styles.pickerLabel}>Record Date:</Text>
        <TouchableOpacity
          style={styles.dateInput}
          onPress={() => setShowDatePicker(true)}
        >
          <Text>{recordDate.toLocaleDateString()}</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={recordDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}

        <FormField
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="Enter health record details"
          iconName="document-text-outline"
          multiline={true}
          numberOfLines={4}
        />

        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => setVaccinationStatus(!vaccinationStatus)}
          >
            {vaccinationStatus && <View style={styles.checkboxInner} />}
          </TouchableOpacity>
          <Text style={styles.checkboxLabel}>Vaccination Completed</Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <Text style={styles.buttonText}>Update Health Record</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: COLORS.secondary, marginTop: 10 },
          ]}
          onPress={() => router.push(`/health-records/${id}`)}
          disabled={saving}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
