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
import COLORS from "../../../../constants/colors";

export default function EditPetTag() {
  const { id } = useLocalSearchParams();
  const [petId, setPetId] = useState("");
  const [tagId, setTagId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pets, setPets] = useState([]);
  const [tags, setTags] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem("userToken");
        const petsRes = await fetch("http://10.0.2.2:5000/api/Pet", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const tagsRes = await fetch("http://10.0.2.2:5000/api/Tag", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const petTagRes = await fetch(`http://10.0.2.2:5000/api/PetTag/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (petsRes.ok && tagsRes.ok && petTagRes.ok) {
          const petsData = await petsRes.json();
          const tagsData = await tagsRes.json();
          const petTagData = await petTagRes.json();
          setPets(petsData);
          setTags(tagsData);
          setPetId(petTagData.petId);
          setTagId(petTagData.tagId);
        } else {
          Alert.alert("Error", "Failed to load data");
          router.back();
        }
      } catch {
        Alert.alert("Error", "An unexpected error occurred");
        router.back();
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async () => {
    if (!petId || !tagId) {
      Alert.alert("Error", "Select pet and tag");
      return;
    }
    try {
      setSaving(true);
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(`http://10.0.2.2:5000/api/PetTag/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, petId, tagId }),
      });
      if (response.ok) {
        Alert.alert("Success", "Pet tag updated", [
          { text: "OK", onPress: () => router.push(`/pet-tags/${id}`) },
        ]);
      } else {
        Alert.alert("Error", "Failed to update pet-tag relation");
      }
    } catch {
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
        <AdminHeader title="Edit Pet Tag" />
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
        <Text style={styles.pickerLabel}>Tag:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={tagId}
            onValueChange={setTagId}
            style={styles.picker}
          >
            {tags.map((tag) => (
              <Picker.Item key={tag.id} label={tag.name} value={tag.id} />
            ))}
          </Picker>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={saving}
        >
          <Text style={styles.buttonText}>Update</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: COLORS.secondary, marginTop: 10 },
          ]}
          onPress={() => router.push(`/pet-tags/${id}`)}
          disabled={saving}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
