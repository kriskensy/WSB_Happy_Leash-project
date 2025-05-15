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

export default function EditBreed() {
  const { id } = useLocalSearchParams();
  const [name, setName] = useState("");
  const [typeId, setTypeId] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [petTypes, setPetTypes] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem("userToken");

        // Fetch pet types
        const typesResponse = await fetch("http://10.0.2.2:5000/api/PetType", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Fetch breed data
        const breedResponse = await fetch(
          `http://10.0.2.2:5000/api/Breed/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (typesResponse.ok && breedResponse.ok) {
          const typesData = await typesResponse.json();
          const breedData = await breedResponse.json();

          setPetTypes(typesData);
          setName(breedData.name);
          setTypeId(breedData.typeId);
          setDescription(breedData.description || "");
        } else {
          Alert.alert("Error", "Failed to load required data");
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

  const handleSubmit = async () => {
    if (!name || !typeId) {
      Alert.alert("Error", "Name and Pet Type are required");
      return;
    }

    try {
      setSaving(true);
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(`http://10.0.2.2:5000/api/Breed/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id,
          name,
          typeId,
          description,
        }),
      });

      if (response.ok) {
        Alert.alert("Success", "Breed updated successfully", [
          { text: "OK", onPress: () => router.push(`/breeds/${id}`) },
        ]);
      } else {
        const errorData = await response.json();
        Alert.alert("Error", errorData.message || "Failed to update breed");
      }
    } catch (error) {
      console.error("Error updating breed:", error);
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
        <AdminHeader title="Edit Breed" />

        <FormField
          label="Breed Name"
          value={name}
          onChangeText={setName}
          placeholder="Enter breed name"
          iconName="paw-outline"
        />

        <Text style={styles.pickerLabel}>Pet Type:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={typeId}
            onValueChange={(itemValue) => setTypeId(itemValue)}
            style={styles.picker}
          >
            {petTypes.map((type) => (
              <Picker.Item key={type.id} label={type.name} value={type.id} />
            ))}
          </Picker>
        </View>

        <FormField
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="Enter description (optional)"
          iconName="document-text-outline"
          multiline={true}
          numberOfLines={3}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <Text style={styles.buttonText}>Update Breed</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: COLORS.secondary, marginTop: 10 },
          ]}
          onPress={() => router.push(`/breeds/${id}`)}
          disabled={saving}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
