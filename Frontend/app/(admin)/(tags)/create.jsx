import { useState, useEffect } from "react";
import {
  View, Text, TouchableOpacity, Alert, ActivityIndicator, ScrollView
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import adminStyles from "../../../assets/styles/admin.styles";
import AdminHeader from "../(components)/AdminHeader";
import FormField from "../(components)/FormField";
import COLORS from "../../../constants/colors";
import DetailRow from "../../../components/DetailRow";

export default function CreateTag() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [pets, setPets] = useState([]);
  const [selectedPetIds, setSelectedPetIds] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchPets = async () => {
      try {
        setFetching(true);
        const token = await AsyncStorage.getItem("userToken");
        const petsRes = await fetch("http://10.0.2.2:5000/api/Pet", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (petsRes.ok) {
          const petsData = await petsRes.json();
          setPets(petsData.map(p => ({ ...p, id: String(p.id) })));
        }
      } catch (e) {
        Alert.alert("Error", "Failed to load pets");
      } finally {
        setFetching(false);
      }
    };
    fetchPets();
  }, []);

  const togglePet = (id) => {
    setSelectedPetIds(prev =>
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (!name) {
      Alert.alert("Error", "Tag name is required");
      return;
    }
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch("http://10.0.2.2:5000/api/Tag", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: (() => {
          const formData = new FormData();
          formData.append("Name", name);
          selectedPetIds.forEach(pid => formData.append("PetIds", pid));
          return formData;
        })(),
      });

      if (response.ok) {
        Alert.alert("Success", "Tag created successfully", [
          { text: "OK", onPress: () => router.push("/(admin)/(tags)") },
        ]);
      } else {
        const errorData = await response.text();
        Alert.alert("Error", errorData || "Failed to create tag");
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <View style={[adminStyles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={adminStyles.container}>
      <AdminHeader title="Create Tag" />
      <FormField
        label="Tag Name"
        value={name}
        onChangeText={setName}
        placeholder="Enter tag name"
        iconName="pricetag-outline"
      />
      <DetailRow
        label="Pets"
        value={
          <View style={{ flex: 1 }}>
            {pets.map((pet) => (
              <TouchableOpacity
                key={pet.id}
                style={[
                  adminStyles.checkboxContainer,
                  { flexDirection: "row", alignItems: "center", marginBottom: 4 },
                ]}
                onPress={() => togglePet(pet.id)}
                accessibilityLabel={`Toggle ${pet.name}`}
              >
                <View style={adminStyles.checkbox}>
                  {selectedPetIds.includes(pet.id) && (
                    <View style={adminStyles.checkboxInner} />
                  )}
                </View>
                <Text style={adminStyles.checkboxLabel}>{pet.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        }
      />
      <TouchableOpacity
        style={adminStyles.mainButton}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color={COLORS.white} />
        ) : (
          <Text style={adminStyles.mainButtonText}>Create Tag</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={[adminStyles.mainButton, { marginTop: 10 }]}
        onPress={() => router.push("/(admin)/(tags)")}
        disabled={loading}
      >
        <Text style={adminStyles.mainButtonText}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
