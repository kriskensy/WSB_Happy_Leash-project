import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Picker } from "@react-native-picker/picker";
import styles from "../../../assets/styles/main.styles";
import AdminHeader from "../components/AdminHeader";
import FormField from "../components/FormField";
import COLORS from "../../../constants/colors";

export default function CreateBreed() {
  const [name, setName] = useState("");
  const [typeId, setTypeId] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [petTypes, setPetTypes] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchPetTypes = async () => {
      try {
        setFetchingData(true);
        const token = await AsyncStorage.getItem("userToken");
        const response = await fetch("http://10.0.2.2:5000/api/PetType", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setPetTypes(data);
          if (data.length > 0) setTypeId(data[0].id);
        } else {
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
        body: JSON.stringify({
          name,
          typeId,
          description
        }),
      });

      if (response.ok) {
        Alert.alert("Success", "Breed created successfully", [
          { text: "OK", onPress: () => router.push("/breeds") }
        ]);
      } else {
        const errorData = await response.json();
        Alert.alert("Error", errorData.message || "Failed to create breed");
      }
    } catch (error) {
      console.error("Error creating breed:", error);
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
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
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <Text style={styles.buttonText}>Create Breed</Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, { backgroundColor: COLORS.secondary, marginTop: 10 }]}
          onPress={() => router.push("/breeds")}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
