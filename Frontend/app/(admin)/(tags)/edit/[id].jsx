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
import adminStyles from "../../../../assets/styles/admin.styles";
import AdminHeader from "../../(components)/AdminHeader";
import FormField from "../../(components)/FormField";
import COLORS from "../../../../constants/colors";
import DetailRow from "../../../../components/DetailRow";

export default function EditTag() {
  const { id } = useLocalSearchParams();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pets, setPets] = useState([]);
  const [selectedPetIds, setSelectedPetIds] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem("userToken");
        const petsRes = await fetch("http://10.0.2.2:5000/api/Pet", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const tagRes = await fetch(`http://10.0.2.2:5000/api/Tag/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (petsRes.ok && tagRes.ok) {
          const petsData = await petsRes.json();
          const tagData = await tagRes.json();
          setPets(petsData.map(p => ({ ...p, id: String(p.id) })));
          setName(tagData.name);
          setSelectedPetIds(
            tagData.pets && tagData.pets.length > 0
              ? tagData.pets.map(p => String(p.id))
              : []
          );
        } else {
          Alert.alert("Error", "Failed to load data");
          router.back();
        }
      } catch (error) {
        Alert.alert("Error", "An unexpected error occurred");
        router.back();
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const togglePet = (id) => {
    setSelectedPetIds((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (!name) {
      Alert.alert("Error", "Tag name is required");
      return;
    }
    try {
      setSaving(true);
      const token = await AsyncStorage.getItem("userToken");
      const formData = new FormData();
      formData.append("Id", id);
      formData.append("Name", name);
      selectedPetIds.forEach(pid => formData.append("PetIds", pid));
      const response = await fetch(`http://10.0.2.2:5000/api/Tag/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        Alert.alert("Success", "Tag updated successfully", [
          { text: "OK", onPress: () => router.push(`/(admin)/(tags)`) },
        ]);
      } else {
        const errorData = await response.text();
        Alert.alert("Error", errorData || "Failed to update tag");
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setSaving(false);
    }
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
      <AdminHeader title="Edit Tag" />
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
        disabled={saving}
        accessibilityLabel="Update tag"
      >
        {saving ? (
          <ActivityIndicator size="small" color={COLORS.white} />
        ) : (
          <Text style={adminStyles.mainButtonText}>Update Tag</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={[adminStyles.mainButton, { marginTop: 10 }]}
        onPress={() => router.push(`/(admin)/(tags)`)}
        disabled={saving}
        accessibilityLabel="Cancel"
      >
        <Text style={adminStyles.mainButtonText}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
