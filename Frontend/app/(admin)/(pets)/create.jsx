import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  Image,
  Modal,
  FlatList,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import * as ImagePicker from "expo-image-picker";
import styles from "../../../assets/styles/main.styles";
import adminStyles from "../../../assets/styles/admin.styles";
import modalStyles from "../../../assets/styles/modal.styles";
import AdminHeader from "../(components)/AdminHeader";
import FormField from "../(components)/FormField";
import COLORS from "../../../constants/colors";
import * as ImagePicker from "expo-image-picker";

export default function CreatePet() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [gender, setGender] = useState("0");
  const [notes, setNotes] = useState("");
  const [breedId, setBreedId] = useState("");
  const [pictureURL, setPictureURL] = useState("");
  const [typeId, setTypeId] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [petTypes, setPetTypes] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [filteredBreeds, setFilteredBreeds] = useState([]);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [showBreedModal, setShowBreedModal] = useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [image, setImage] = useState(null);

  const router = useRouter();

  const genderOptions = [
    { id: "0", name: "Male" },
    { id: "1", name: "Female" },
  ];

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
          if (typesData.length > 0) {
            setTypeId(typesData[0].id);
            const initialFilteredBreeds = breedsData.filter(
              (breed) => breed.typeId === typesData[0].id
            );
            setFilteredBreeds(initialFilteredBreeds);
            if (initialFilteredBreeds.length > 0) {
              setBreedId(initialFilteredBreeds[0].id);
            }
          }
        } else {
          Alert.alert("Error", "Failed to load pet types or breeds");
        }
      } catch (error) {
        Alert.alert("Error", "An unexpected error occurred");
      } finally {
        setFetchingData(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (typeId !== undefined && breeds.length > 0) {
      //konwersja do tego samego typu danych
      const numericTypeId = Number(typeId);

      //filtrowanie z jawną konwersją
      const filtered = breeds.filter(
        (breed) => Number(breed.petTypeId) === numericTypeId
      );

      setFilteredBreeds(filtered);
      // Reset breedId jeśli nie pasuje do nowego typu
      if (
        filtered.length > 0 &&
        !filtered.some((breed) => breed.id === breedId)
      ) {
        setBreedId(filtered[0].id);
      }
    }
  }, [typeId, breeds]);

  //TODO brakuje dodawania zdjęcia zwierzaka do rekordu

  // const handleImagePick = async () => {
  //   try {
  //     const result = await ImagePicker.launchImageLibraryAsync({
  //       mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //       allowsEditing: true,
  //       quality: 1,
  //     });
  //     if (!result.canceled && result.assets && result.assets.length > 0) {
  //       setPictureURL(result.assets[0].uri);
  //     }
  //   } catch (error) {
  //     Alert.alert("Error", "Could not select image");
  //   }
  // };

  const handleSubmit = async () => {
    if (!name || !breedId || !age || !weight) {
      Alert.alert("Error", "Name, breed, age and weight are required");
      return;
    }
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");

      const formData = new FormData();
      formData.append("Name", name);
      formData.append("Age", parseInt(age, 10));
      formData.append("Weight", parseFloat(weight));
      formData.append("Gender", parseInt(gender, 10));
      formData.append("Notes", notes);
      formData.append("BreedId", breedId);

      // dodaj obraz jeśli jest wybrany
      if (pictureURL) {
        formData.append("Picture", {
          uri: pictureURL,
          name: "photo.jpg",
          type: "image/jpeg",
        });

        const response = await fetch("http://10.0.2.2:5000/api/Pet", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (response.ok) {
          Alert.alert("Success", "Pet created successfully", [
            { text: "OK", onPress: () => router.push("/(admin)/(pets)") },
          ]);
        } else {
          const errorText = await response.text();
          Alert.alert("Error", errorText || "Failed to create pet");
        }
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  //obsługa wyboru zdjęcia
  const handleChoseImage = async () => {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    console.log(pickerResult);
    handleImagePicked(pickerResult);
  };

  // wywołanie metody zapisującej zdjęcie jeśli operacją wybierania zdjęcia się powiodła
  const handleImagePicked = async (pickerResult) => {
    try {
      if (!pickerResult.canceled && pickerResult.assets?.length > 0) {
        const uri = pickerResult.assets[0].uri;
        setPictureURL(uri); // dołączane później do FormData
      }
    } catch (e) {
      console.log(e);
      Alert.alert("Błąd", "Nie udało się wczytać zdjęcia");
    }
  };

  const getTypeName = (id) => {
    const type = petTypes.find((t) => t.id === id);
    return type ? type.name : "Select Pet Type";
  };

  const getBreedName = (id) => {
    const breed = breeds.find((b) => b.id === id);
    return breed ? breed.name : "Select Breed";
  };

  const getGenderName = (id) => {
    const option = genderOptions.find((g) => g.id === id);
    return option ? option.name : "Select Gender";
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
        <TouchableOpacity
          style={styles.pickerContainer}
          onPress={() => setShowTypeModal(true)}
          accessibilityLabel="Select pet type"
          accessible
        >
          <Text>{getTypeName(typeId)}</Text>
        </TouchableOpacity>
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
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => {
                      setTypeId(item.id);
                      setShowTypeModal(false);
                    }}
                    style={modalStyles.modalItem}
                    accessibilityLabel={`Select ${item.name}`}
                    accessible
                  >
                    <Text>{item.name}</Text>
                  </Pressable>
                )}
              />
              <TouchableOpacity
                onPress={() => setShowTypeModal(false)}
                style={modalStyles.modalCloseButton}
                accessibilityLabel="Close pet type selection"
                accessible
              >
                <Text style={{ color: COLORS.primary }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Text style={styles.pickerLabel}>Breed:</Text>
        <TouchableOpacity
          style={styles.pickerContainer}
          onPress={() => setShowBreedModal(true)}
          accessibilityLabel="Select pet breed"
          accessible
        >
          <Text>{getBreedName(breedId)}</Text>
        </TouchableOpacity>
        <Modal
          visible={showBreedModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowBreedModal(false)}
        >
          <View style={modalStyles.modalOverlay}>
            <View style={modalStyles.modalContent}>
              <FlatList
                data={filteredBreeds}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => {
                      setBreedId(item.id);
                      setShowBreedModal(false);
                    }}
                    style={modalStyles.modalItem}
                    accessibilityLabel={`Select ${item.name}`}
                    accessible
                  >
                    <Text>{item.name}</Text>
                  </Pressable>
                )}
                ListEmptyComponent={
                  <Text style={{ padding: 20, textAlign: "center" }}>
                    No breeds available for selected type
                  </Text>
                }
              />
              <TouchableOpacity
                onPress={() => setShowBreedModal(false)}
                style={modalStyles.modalCloseButton}
                accessibilityLabel="Close breed selection"
                accessible
              >
                <Text style={{ color: COLORS.primary }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <FormField
          label="Age"
          value={age}
          onChangeText={(text) => setAge(text.replace(/[^0-9]/g, ""))}
          placeholder="Enter age"
          iconName="calendar-outline"
          keyboardType="numeric"
        />

        <FormField
          label="Weight"
          value={weight}
          onChangeText={(text) => setWeight(text.replace(/[^0-9.]/g, ""))}
          placeholder="Enter weight"
          iconName="fitness-outline"
          keyboardType="numeric"
        />

        <Text style={styles.pickerLabel}>Gender:</Text>
        <TouchableOpacity
          style={styles.pickerContainer}
          onPress={() => setShowGenderModal(true)}
          accessibilityLabel="Select gender"
          accessible
        >
          <Text>{getGenderName(gender)}</Text>
        </TouchableOpacity>
        <Modal
          visible={showGenderModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowGenderModal(false)}
        >
          <View style={modalStyles.modalOverlay}>
            <View style={modalStyles.modalContent}>
              <FlatList
                data={genderOptions}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => {
                      setGender(item.id);
                      setShowGenderModal(false);
                    }}
                    style={modalStyles.modalItem}
                    accessibilityLabel={`Select ${item.name}`}
                    accessible
                  >
                    <Text>{item.name}</Text>
                  </Pressable>
                )}
              />
              <TouchableOpacity
                onPress={() => setShowGenderModal(false)}
                style={modalStyles.modalCloseButton}
                accessibilityLabel="Close gender selection"
                accessible
              >
                <Text style={{ color: COLORS.primary }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <FormField
          label="Notes"
          value={notes}
          onChangeText={setNotes}
          placeholder="Enter notes about this pet"
          iconName="document-text-outline"
          multiline={true}
          numberOfLines={3}
        />

        {/* <TouchableOpacity
          style={styles.button}
          onPress={handleImagePick}
          accessibilityLabel="Pick image"
          accessible
        >
          <Text style={styles.buttonText}>Pick Image</Text>
        </TouchableOpacity>

        {pictureURL ? (
          <View style={{ alignItems: "center", marginVertical: 10 }}>
            <Image
              source={{ uri: pictureURL }}
              style={{
                width: 100,
                height: 100,
                borderRadius: 8,
              }}
            />
          </View>
        ) : null} */}
        {image && (
          <Image
            source={{ uri: image }}
            style={{ width: 300, height: 300, borderRadius: 10 }}
          />
        )}
        <TouchableOpacity
          style={adminStyles.mainButton}
          onPress={() => handleChoseImage()}
          disabled={loading}
          accessibilityLabel="Cancel"
          accessible
        >
          <Text style={adminStyles.mainButtonText}>Chose pet Image</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={loading}
          accessibilityLabel="Create pet"
          accessible
        >
          {loading ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <Text style={styles.buttonText}>Create Pet</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={adminStyles.mainButton}
          onPress={() => router.push("/(admin)/(pets)")}
          disabled={loading}
          accessibilityLabel="Cancel"
          accessible
        >
          <Text style={adminStyles.mainButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
