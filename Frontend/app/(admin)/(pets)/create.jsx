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
import * as ImagePicker from "expo-image-picker";
import adminStyles from "../../../assets/styles/admin.styles";
import modalStyles from "../../../assets/styles/modal.styles";
import AdminHeader from "../(components)/AdminHeader";
import FormField from "../(components)/FormField";
import COLORS from "../../../constants/colors";
import DetailRow from "../../../components/DetailRow";

export default function CreatePet() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [gender, setGender] = useState("0");
  const [notes, setNotes] = useState("");
  const [breedId, setBreedId] = useState("");
  const [pictureURL, setPictureURL] = useState("");
  const [typeId, setTypeId] = useState("");
  const [adopted, setAdopted] = useState(false);
  const [selectedTagIds, setSelectedTagIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [petTypes, setPetTypes] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [filteredBreeds, setFilteredBreeds] = useState([]);
  const [tags, setTags] = useState([]);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [showBreedModal, setShowBreedModal] = useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false);

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
        const tagsRes = await fetch("http://10.0.2.2:5000/api/Tag", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (typesRes.ok && breedsRes.ok && tagsRes.ok) {
          const typesData = await typesRes.json();
          const breedsData = await breedsRes.json();
          const tagsData = await tagsRes.json();
          setPetTypes(typesData);
          setBreeds(breedsData);
          setTags(tagsData.map((tag) => ({ ...tag, id: String(tag.id) })));
          if (typesData.length > 0) {
            const firstTypeId = String(typesData[0].id);
            setTypeId(firstTypeId);
            const initialFilteredBreeds = breedsData.filter(
              (breed) => String(breed.petTypeId) === firstTypeId
            );
            setFilteredBreeds(initialFilteredBreeds);
            if (initialFilteredBreeds.length > 0) {
              setBreedId(String(initialFilteredBreeds[0].id));
            } else {
              setBreedId("");
            }
          }
        } else {
          Alert.alert("Error", "Failed to load pet types, breeds or tags");
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
    if (typeId && breeds.length > 0) {
      const filtered = breeds.filter(
        (breed) => String(breed.petTypeId) === String(typeId)
      );
      setFilteredBreeds(filtered);
      if (
        filtered.length > 0 &&
        !filtered.some((breed) => String(breed.id) === String(breedId))
      ) {
        setBreedId(String(filtered[0].id));
      }
      if (filtered.length === 0) {
        setBreedId("");
      }
    }
  }, [typeId, breeds]);

  const handleChoseImage = async () => {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!pickerResult.canceled && pickerResult.assets?.length > 0) {
      setPictureURL(pickerResult.assets[0].uri);
    }
  };

  const toggleTag = (id) => {
    setSelectedTagIds((prev) =>
      prev.includes(id) ? prev.filter((tid) => tid !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (!name) {
      Alert.alert("Error", "Name is required");
      return;
    }
    if (!typeId) {
      Alert.alert("Error", "Type is required");
      return;
    }
    if (!breedId) {
      Alert.alert("Error", "Breed is required");
      return;
    }
    if (!age) {
      Alert.alert("Error", "Age is required");
      return;
    }
    if (!weight) {
      Alert.alert("Error", "Weight is required");
      return;
    }
    if (!notes) {
      Alert.alert("Error", "Note is required");
      return;
    }
    if (!gender) {
      Alert.alert("Error", "Gender is required");
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
      formData.append("GenderName", genderOptions.find(g => g.id === gender)?.name || "");
      formData.append("Notes", notes);
      formData.append("BreedId", parseInt(breedId, 10));
      formData.append("Adopted", adopted);

      //TODO dodanie tagów jako tablicę do API
      selectedTagIds.forEach((tagId) => {
        formData.append("TagIds", parseInt(tagId, 10));
      });

      if (pictureURL) {
        formData.append("Picture", {
          uri: pictureURL,
          name: "photo.jpg",
          type: "image/jpeg",
        });
      }

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
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getTypeName = (id) => {
    const type = petTypes.find((t) => String(t.id) === String(id));
    return type ? type.name : "Select Pet Type";
  };

  const getBreedName = (id) => {
    const breed = breeds.find((b) => String(b.id) === String(id));
    return breed ? breed.name : "Select Breed";
  };

  const getGenderName = (id) => {
    const option = genderOptions.find((g) => g.id === id);
    return option ? option.name : "Select Gender";
  };

  if (fetchingData) {
    return (
      <View style={[adminStyles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={adminStyles.container}>
      <AdminHeader title="Create Pet" />

      <FormField
        label="Name"
        value={name}
        onChangeText={setName}
        placeholder="Enter pet name"
        iconName="paw-outline"
      />

      <DetailRow
        label="Type"
        value={
          <TouchableOpacity
            style={adminStyles.pickerContainer}
            onPress={() => setShowTypeModal(true)}
            accessibilityLabel="Select pet type"
          >
            <Text>{getTypeName(typeId)}</Text>
          </TouchableOpacity>
        }
      />
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

      <DetailRow
        label="Breed"
        value={
          <TouchableOpacity
            style={adminStyles.pickerContainer}
            onPress={() => setShowBreedModal(true)}
            accessibilityLabel="Select pet breed"
          >
            <Text>{getBreedName(breedId)}</Text>
          </TouchableOpacity>
        }
      />
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
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    setBreedId(String(item.id));
                    setShowBreedModal(false);
                  }}
                  style={modalStyles.modalItem}
                  accessibilityLabel={`Select ${item.name}`}
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

      <DetailRow
        label="Gender"
        value={
          <TouchableOpacity
            style={adminStyles.pickerContainer}
            onPress={() => setShowGenderModal(true)}
            accessibilityLabel="Select gender"
          >
            <Text>{getGenderName(gender)}</Text>
          </TouchableOpacity>
        }
      />
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
                >
                  <Text>{item.name}</Text>
                </Pressable>
              )}
            />
            <TouchableOpacity
              onPress={() => setShowGenderModal(false)}
              style={modalStyles.modalCloseButton}
              accessibilityLabel="Close gender selection"
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

      <DetailRow
        label="Tags"
        value={
          <View style={{ flex: 1 }}>
            {tags.map((tag) => (
              <TouchableOpacity
                key={tag.id}
                style={[
                  adminStyles.checkboxContainer,
                  {
                    marginLeft: -8,
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 4,
                  },
                ]}
                onPress={() => toggleTag(tag.id)}
                accessibilityLabel={`Toggle ${tag.name}`}
              >
                <View style={adminStyles.checkbox}>
                  {selectedTagIds.includes(tag.id) && (
                    <View style={adminStyles.checkboxInner} />
                  )}
                </View>
                <Text style={adminStyles.checkboxLabel}>{tag.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        }
      />

      <DetailRow
        label="Adopted"
        value={
          <TouchableOpacity
            style={[adminStyles.checkboxContainer, { marginLeft: -8 }]}
            onPress={() => setAdopted((prev) => !prev)}
            accessibilityLabel="Toggle adopted"
          >
            <View style={adminStyles.checkbox}>
              {adopted && <View style={adminStyles.checkboxInner} />}
            </View>
            <Text style={adminStyles.checkboxLabel}>Adopted</Text>
          </TouchableOpacity>
        }
      />

      {pictureURL ? (
        <View style={{ alignItems: "center", marginVertical: 10 }}>
          <Image
            source={{ uri: pictureURL }}
            style={{
              width: 120,
              height: 120,
              borderRadius: 8,
            }}
          />
        </View>
      ) : null}
      <TouchableOpacity
        style={adminStyles.mainButton}
        onPress={handleChoseImage}
        disabled={loading}
        accessibilityLabel="Pick pet image"
      >
        <Text style={adminStyles.mainButtonText}>Pick Pet Image</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={adminStyles.mainButton}
        onPress={handleSubmit}
        disabled={loading}
        accessibilityLabel="Create pet"
      >
        {loading ? (
          <ActivityIndicator size="small" color={COLORS.white} />
        ) : (
          <Text style={adminStyles.mainButtonText}>Create Pet</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[adminStyles.mainButton, { marginTop: 10 }]}
        onPress={() => router.push("/(admin)/(pets)")}
        disabled={loading}
        accessibilityLabel="Cancel"
      >
        <Text style={adminStyles.mainButtonText}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
