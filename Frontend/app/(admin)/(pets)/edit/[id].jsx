import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  Image,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Picker } from "@react-native-picker/picker";
// import * as ImagePicker from "expo-image-picker";
import styles from "../../../../assets/styles/main.styles";
import AdminHeader from "../../(components)/AdminHeader";
import FormField from "../../(components)/FormField";
import COLORS from "../../../../constants/colors";

export default function EditPet() {
  const { id } = useLocalSearchParams();
  const [name, setName] = useState("");
  const [typeId, setTypeId] = useState("");
  const [breedId, setBreedId] = useState("");
  const [age, setAge] = useState("");
  const [description, setDescription] = useState("");
  const [adopted, setAdopted] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [petTypes, setPetTypes] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem("userToken");
        const typesRes = await fetch("http://10.0.2.2:5000/api/PetType", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const breedsRes = await fetch("http://10.0.2.2:5000/api/Breed", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const petRes = await fetch(`http://10.0.2.2:5000/api/Pet/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (typesRes.ok && breedsRes.ok && petRes.ok) {
          const typesData = await typesRes.json();
          const breedsData = await breedsRes.json();
          const petData = await petRes.json();
          setPetTypes(typesData);
          setBreeds(breedsData);
          setName(petData.name);
          setTypeId(petData.typeId);
          setBreedId(petData.breedId);
          setAge(petData.age.toString());
          setDescription(petData.description || "");
          setAdopted(petData.adopted);
          setImageUrl(petData.imageUrl || "");
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

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled && result.assets.length > 0) {
      setImageUrl(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!name || !typeId || !breedId || !age) {
      Alert.alert(
        "Error",
        "All fields except description and image are required"
      );
      return;
    }
    try {
      setSaving(true);
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(`http://10.0.2.2:5000/api/Pet/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id,
          name,
          typeId,
          breedId,
          age: parseInt(age, 10),
          description,
          adopted,
          imageUrl,
        }),
      });
      if (response.ok) {
        Alert.alert("Success", "Pet updated", [
          { text: "OK", onPress: () => router.push(`/pets/${id}`) },
        ]);
      } else {
        Alert.alert("Error", "Failed to update pet");
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
        <AdminHeader title="Edit Pet" />
        <FormField
          label="Name"
          value={name}
          onChangeText={setName}
          placeholder="Enter pet name"
          iconName="paw-outline"
        />
        <Text style={styles.pickerLabel}>Type:</Text>
        <View style={styles.pickerContainer}>
          {/* <Picker
            selectedValue={typeId}
            onValueChange={setTypeId}
            style={styles.picker}
          >
            {petTypes.map((type) => (
              <Picker.Item key={type.id} label={type.name} value={type.id} />
            ))}
          </Picker> */}
        </View>
        <Text style={styles.pickerLabel}>Breed:</Text>
        <View style={styles.pickerContainer}>
          {/* <Picker
            selectedValue={breedId}
            onValueChange={setBreedId}
            style={styles.picker}
          >
            {breeds.map((breed) => (
              <Picker.Item key={breed.id} label={breed.name} value={breed.id} />
            ))}
          </Picker> */}
        </View>
        <FormField
          label="Age"
          value={age}
          onChangeText={setAge}
          placeholder="Enter age"
          iconName="calendar-outline"
          keyboardType="numeric"
        />
        <FormField
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="Enter description"
          iconName="document-text-outline"
          multiline={true}
          numberOfLines={3}
        />
        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => setAdopted(!adopted)}
          >
            {adopted && <View style={styles.checkboxInner} />}
          </TouchableOpacity>
          <Text style={styles.checkboxLabel}>Adopted</Text>
        </View>
        <TouchableOpacity
          style={styles.imagePickerButton}
          onPress={handleImagePick}
        >
          <Text style={styles.buttonText}>Pick Image</Text>
        </TouchableOpacity>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={{
              width: 100,
              height: 100,
              marginVertical: 10,
              borderRadius: 8,
            }}
          />
        ) : null}
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={saving}
        >
          <Text style={styles.buttonText}>Update Pet</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: COLORS.secondary, marginTop: 10 },
          ]}
          onPress={() => router.push(`/pets/${id}`)}
          disabled={saving}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
