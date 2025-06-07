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
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import adminStyles from "../../../../assets/styles/admin.styles";
import modalStyles from "../../../../assets/styles/modal.styles";
import AdminHeader from "../../(components)/AdminHeader";
import FormField from "../../(components)/FormField";
import COLORS from "../../../../constants/colors";
import DetailRow from "../../../../components/DetailRow";

export default function EditBreed() {
  const { id } = useLocalSearchParams();
  const [name, setName] = useState("");
  const [typeId, setTypeId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [petTypes, setPetTypes] = useState([]);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem("userToken");
        const typesResponse = await fetch("http://10.0.2.2:5000/api/PetType", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const breedResponse = await fetch(
          `http://10.0.2.2:5000/api/Breed/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (typesResponse.ok && breedResponse.ok) {
          const typesData = await typesResponse.json();
          const breedData = await breedResponse.json();

          setPetTypes(typesData);
          setName(breedData.name);
          setTypeId(String(breedData.petTypeId ?? breedData.typeId ?? "")); // obsługa różnych nazw klucza
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
          petTypeId: Number(typeId),
        }),
      });

      if (response.ok) {
        Alert.alert("Success", "Breed updated successfully", [
          { text: "OK", onPress: () => router.push(`/(breeds)/${id}`) },
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

  const getTypeName = (id) => {
    const type = petTypes.find((t) => String(t.id) === String(id));
    return type ? type.name : "Select Pet Type";
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
      <AdminHeader title="Edit Breed" />

      <FormField
        label="Breed Name"
        value={name}
        onChangeText={setName}
        placeholder="Enter breed name"
        iconName="paw-outline"
      />

      <DetailRow label="Pet type" value={
      <TouchableOpacity
        style={adminStyles.pickerContainer}
        onPress={() => setShowTypeModal(true)}
        accessibilityLabel="Select pet type"
      >
        <Text>{getTypeName(typeId)}</Text>
      </TouchableOpacity>
      }/>

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
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    setTypeId(String(item.id));
                    setShowTypeModal(false);
                  }}
                  style={modalStyles.modalItem}
                  accessibilityLabel={`Select ${item.name}`}
                >
                  <Text>{item.name}</Text>
                </Pressable>
              )}
            />
            <TouchableOpacity
              onPress={() => setShowTypeModal(false)}
              style={modalStyles.modalCloseButton}
              accessibilityLabel="Close pet type selection"
            >
              <Text style={{ color: COLORS.primary }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TouchableOpacity
        style={adminStyles.mainButton}
        onPress={handleSubmit}
        disabled={saving}
        accessibilityLabel="Update breed"
      >
        {saving ? (
          <ActivityIndicator size="small" color={COLORS.white} />
        ) : (
          <Text style={adminStyles.mainButtonText}>Update Breed</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[adminStyles.mainButton, { marginTop: 10 }]}
        onPress={() => router.push(`/(admin)/(breeds)`)}
        disabled={saving}
        accessibilityLabel="Cancel"
      >
        <Text style={adminStyles.mainButtonText}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
