import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Picker } from "@react-native-picker/picker";
// import * as ImagePicker from "expo-image-picker";
import styles from "../../../assets/styles/main.styles";
import AdminHeader from "../(components)/AdminHeader";
import FormField from "../(components)/FormField";
import COLORS from "../../../constants/colors";

export default function CreatePet() {
  const [name, setName] = useState("");
  const [typeId, setTypeId] = useState("");
  const [breedId, setBreedId] = useState("");
  const [age, setAge] = useState("");
  const [description, setDescription] = useState("");
  const [adopted, setAdopted] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [petTypes, setPetTypes] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetchingData(true);
        const token = await AsyncStorage.getItem("userToken");
        const typesRes = await fetch("http://10.0.2.2:5000/api/PetType", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const breedsRes = await fetch("http://10.0.2.2:5000/api/Breed", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (typesRes.ok && breedsRes.ok) {
          const typesData = await typesRes.json();
          const breedsData = await breedsRes.json();
          setPetTypes(typesData);
          setBreeds(breedsData);
          if (typesData.length > 0) setTypeId(typesData[0].id);
          if (breedsData.length > 0) setBreedId(breedsData[0].id);
        } else {
          Alert.alert("Error", "Failed to load pet types or breeds");
        }
      } catch {
        Alert.alert("Error", "An unexpected error occurred");
      } finally {
        setFetchingData(false);
      }
    };
    fetchData();
  }, []);

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
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch("http://10.0.2.2:5000/api/Pet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
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
        Alert.alert("Success", "Pet created successfully", [
          { text: "OK", onPress: () => router.push("/pets") },
        ]);
      } else {
        Alert.alert("Error", "Failed to create pet");
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
        <AdminHeader title="Create Pet" />
        <FormField
          label="Name"
          value={name}
          onChangeText={setName}
          placeholder="Enter pet name"
          iconName="paw-outline"
        />
        <Text style={styles.pickerLabel}>Type:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={typeId}
            onValueChange={setTypeId}
            style={styles.picker}
          >
            {petTypes.map((type) => (
              <Picker.Item key={type.id} label={type.name} value={type.id} />
            ))}
          </Picker>
        </View>
        <Text style={styles.pickerLabel}>Breed:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={breedId}
            onValueChange={setBreedId}
            style={styles.picker}
          >
            {breeds.map((breed) => (
              <Picker.Item key={breed.id} label={breed.name} value={breed.id} />
            ))}
          </Picker>
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
          disabled={loading}
        >
          <Text style={styles.buttonText}>Create Pet</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: COLORS.secondary, marginTop: 10 },
          ]}
          onPress={() => router.push("/pets")}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
