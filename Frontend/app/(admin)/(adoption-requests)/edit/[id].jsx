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
import styles from "../../../../assets/styles/main.styles";
import AdminHeader from "../../(components)/AdminHeader";
import FormField from "../../(components)/FormField";
import COLORS from "../../../../constants/colors";

export default function EditAdoptionRequest() {
  const { id } = useLocalSearchParams();
  const [petId, setPetId] = useState("");
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");
  const [requestDate, setRequestDate] = useState("");
  const [isApproved, setIsApproved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pets, setPets] = useState([]);
  const [users, setUsers] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem("userToken");

        // Fetch pets
        const petsResponse = await fetch("http://10.0.2.2:5000/api/Pet", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Fetch users
        const usersResponse = await fetch("http://10.0.2.2:5000/api/User", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Fetch adoption request
        const adoptionRequestResponse = await fetch(
          `http://10.0.2.2:5000/api/AdoptionRequest/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (petsResponse.ok && usersResponse.ok && adoptionRequestResponse.ok) {
          const petsData = await petsResponse.json();
          const usersData = await usersResponse.json();
          const adoptionRequestData = await adoptionRequestResponse.json();

          setPets(petsData);
          setUsers(usersData);

          setPetId(adoptionRequestData.petId);
          setUserId(adoptionRequestData.userId);
          setMessage(adoptionRequestData.message || "");
          setRequestDate(adoptionRequestData.requestDate);
          setIsApproved(adoptionRequestData.isApproved);
        } else {
          Alert.alert("Error", "Failed to load required data");
          router.back();
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        Alert.alert("Error", "An unexpected error occurred while loading data");
        router.back();
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async () => {
    if (!petId || !userId) {
      Alert.alert("Error", "Pet and User are required");
      return;
    }

    try {
      setSaving(true);
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(
        `http://10.0.2.2:5000/api/AdoptionRequest/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id,
            petId,
            userId,
            message,
            requestDate,
            isApproved,
          }),
        }
      );

      if (response.ok) {
        Alert.alert("Success", "Adoption request updated successfully", [
          {
            text: "OK",
            onPress: () => router.push(`/adoption-requests/${id}`),
          },
        ]);
      } else {
        const errorData = await response.json();
        Alert.alert(
          "Error",
          errorData.message || "Failed to update adoption request"
        );
      }
    } catch (error) {
      console.error("Error updating adoption request:", error);
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
        <AdminHeader title="Edit Adoption Request" />

        <Text style={styles.pickerLabel}>Pet:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={petId}
            onValueChange={(itemValue) => setPetId(itemValue)}
            style={styles.picker}
          >
            {pets.map((pet) => (
              <Picker.Item key={pet.id} label={pet.name} value={pet.id} />
            ))}
          </Picker>
        </View>

        <Text style={styles.pickerLabel}>User:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={userId}
            onValueChange={(itemValue) => setUserId(itemValue)}
            style={styles.picker}
          >
            {users.map((user) => (
              <Picker.Item
                key={user.id}
                label={`${user.firstName} ${user.lastName}`}
                value={user.id}
              />
            ))}
          </Picker>
        </View>

        <FormField
          label="Message"
          value={message}
          onChangeText={setMessage}
          placeholder="Enter message"
          iconName="chatbox-outline"
          multiline={true}
          numberOfLines={4}
        />

        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => setIsApproved(!isApproved)}
          >
            {isApproved && <View style={styles.checkboxInner} />}
          </TouchableOpacity>
          <Text style={styles.checkboxLabel}>Approved</Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <Text style={styles.buttonText}>Update Adoption Request</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: COLORS.secondary, marginTop: 10 },
          ]}
          onPress={() => router.push(`/adoption-requests/${id}`)}
          disabled={saving}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
