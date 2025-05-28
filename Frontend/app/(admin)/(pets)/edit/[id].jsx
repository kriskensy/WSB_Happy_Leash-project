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
  Image,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import adminStyles from "../../../../assets/styles/admin.styles";
import modalStyles from "../../../../assets/styles/modal.styles";
import AdminHeader from "../../(components)/AdminHeader";
import FormField from "../../(components)/FormField";
import COLORS from "../../../../constants/colors";
import DetailRow from "../../../../components/DetailRow";

export default function EditPet() {
  const { id } = useLocalSearchParams();
  const [name, setName] = useState("");
  const [typeId, setTypeId] = useState("");
  const [breedId, setBreedId] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [gender, setGender] = useState("0");
  const [notes, setNotes] = useState("");
  const [adopted, setAdopted] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [petTypes, setPetTypes] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [filteredBreeds, setFilteredBreeds] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTagIds, setSelectedTagIds] = useState([]);
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
        setLoading(true);
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
        const petRes = await fetch(`http://10.0.2.2:5000/api/Pet/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (typesRes.ok && breedsRes.ok && tagsRes.ok && petRes.ok) {
          const typesData = await typesRes.json();
          const breedsData = await breedsRes.json();
          const tagsData = await tagsRes.json();
          const petData = await petRes.json();
          setPetTypes(typesData);
          setBreeds(breedsData);
          setTags(tagsData.map((tag) => ({ ...tag, id: String(tag.id) })));
          setName(petData.name);
          setTypeId(String(petData.typeId));
          setBreedId(String(petData.breedId));
          setAge(petData.age?.toString() || "");
          setWeight(petData.weight?.toString() || "");
          setNotes(petData.notes || "");
          setAdopted(petData.adopted);
          setImageUrl(petData.imageUrl || "");
          setGender(String(petData.gender));
          //TODO inicjalizacja tagów
          setSelectedTagIds(
            petData.tags && petData.tags.length > 0
              ? petData.tags.map((t) => String(t.id))
              : []
          );
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
    if (!gender) {
      Alert.alert("Error", "Gender is required");
      return;
    }
    if (!notes) {
      Alert.alert("Error", "Note is required");
      return;
    }
    try {
      setSaving(true);
      const token = await AsyncStorage.getItem("userToken");

      const formData = new FormData();
      formData.append("Id", id);
      formData.append("Name", name);
      formData.append("TypeId", parseInt(typeId, 10));
      formData.append("BreedId", parseInt(breedId, 10));
      formData.append("Age", parseInt(age, 10));
      formData.append("Weight", parseFloat(weight));
      formData.append("Gender", parseInt(gender, 10));
      formData.append("GenderName", genderOptions.find(g => g.id === gender)?.name || "");
      formData.append("Notes", notes);
      formData.append("Adopted", adopted);

      //TODO dodanie tagów jako tablicę do API
      selectedTagIds.forEach((tagId) => {
        formData.append("TagIds", parseInt(tagId, 10));
      });

      if (imageUrl) {
        formData.append("Picture", {
          uri: imageUrl,
          name: "photo.jpg",
          type: "image/jpeg",
        });
      }

      const response = await fetch(`http://10.0.2.2:5000/api/Pet/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        Alert.alert("Success", "Pet updated", [
          { text: "OK", onPress: () => router.push("/(admin)/(pets)") },
        ]);
      } else {
        const errorText = await response.text();
        Alert.alert("Error", errorText || "Failed to update pet");
      }
    } catch {
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setSaving(false);
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

  if (loading) {
    return (
      <View style={[adminStyles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={adminStyles.container}>
      <AdminHeader title="Edit Pet" />

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
        onChangeText={setAge}
        placeholder="Enter age"
        iconName="calendar-outline"
        keyboardType="numeric"
      />

      <FormField
        label="Weight"
        value={weight}
        onChangeText={setWeight}
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

      {imageUrl ? (
        <View style={{ alignItems: "center", marginVertical: 10 }}>
          <Image
            source={{ uri: imageUrl }}
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
        onPress={handleImagePick}
        accessibilityLabel="Pick pet image"
      >
        <Text style={adminStyles.mainButtonText}>Pick Image</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={adminStyles.mainButton}
        onPress={handleSubmit}
        disabled={saving}
        accessibilityLabel="Update pet"
      >
        {saving ? (
          <ActivityIndicator size="small" color={COLORS.white} />
        ) : (
          <Text style={adminStyles.mainButtonText}>Update Pet</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[adminStyles.mainButton, { marginTop: 10 }]}
        onPress={() => router.push("/(admin)/(pets)")}
        disabled={saving}
        accessibilityLabel="Cancel"
      >
        <Text style={adminStyles.mainButtonText}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
