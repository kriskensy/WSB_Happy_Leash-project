import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Picker } from "@react-native-picker/picker";
import styles from "../../../assets/styles/main.styles";
import AdminHeader from "../(components)/AdminHeader";
import COLORS from "../../../constants/colors";

export default function CreatePetTag() {
  const [petId, setPetId] = useState("");
  const [tagId, setTagId] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [pets, setPets] = useState([]);
  const [tags, setTags] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetchingData(true);
        const token = await AsyncStorage.getItem("userToken");
        const petsRes = await fetch("http://10.0.2.2:5000/api/Pet", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const tagsRes = await fetch("http://10.0.2.2:5000/api/Tag", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (petsRes.ok && tagsRes.ok) {
          const petsData = await petsRes.json();
          const tagsData = await tagsRes.json();
          setPets(petsData);
          setTags(tagsData);
          if (petsData.length > 0) setPetId(petsData[0].id);
          if (tagsData.length > 0) setTagId(tagsData[0].id);
        } else {
          Alert.alert("Error", "Failed to load pets or tags");
        }
      } catch {
        Alert.alert("Error", "An unexpected error occurred");
      } finally {
        setFetchingData(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (!petId || !tagId) {
      Alert.alert("Error", "Select pet and tag");
      return;
    }
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch("http://10.0.2.2:5000/api/PetTag", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ petId, tagId }),
      });
      if (response.ok) {
        Alert.alert("Success", "Pet tag added", [
          { text: "OK", onPress: () => router.push("/pet-tags") },
        ]);
      } else {
        Alert.alert("Error", "Failed to create pet-tag relation");
      }
    } catch {
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
        <AdminHeader title="Add Pet Tag" />
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
          disabled={loading}
        >
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: COLORS.secondary, marginTop: 10 },
          ]}
          onPress={() => router.push("/pet-tags")}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
