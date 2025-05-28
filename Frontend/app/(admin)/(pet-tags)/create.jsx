import { useState, useEffect } from "react";
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
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import adminStyles from "../../../assets/styles/admin.styles";
import modalStyles from "../../../assets/styles/modal.styles";
import AdminHeader from "../(components)/AdminHeader";
import COLORS from "../../../constants/colors";
import DetailRow from "../../../components/DetailRow";

export default function CreatePetTag() {
  const [petId, setPetId] = useState("");
  const [tagId, setTagId] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [pets, setPets] = useState([]);
  const [tags, setTags] = useState([]);
  const [showPetModal, setShowPetModal] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);
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

          setPets(petsData.map((pet) => ({ ...pet, id: String(pet.id) })));
          setTags(tagsData.map((tag) => ({ ...tag, id: String(tag.id) })));

          if (petsData.length > 0) setPetId(String(petsData[0].id));
          if (tagsData.length > 0) setTagId(String(tagsData[0].id));
        } else {
          Alert.alert("Error", "Failed to load pets or tags");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
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

      const payload = {
        petId: parseInt(petId, 10),
        tagId: parseInt(tagId, 10),
      };

      const response = await fetch("http://10.0.2.2:5000/api/PetTag", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        Alert.alert("Success", "Pet tag added", [
          { text: "OK", onPress: () => router.push("/(admin)/(pet-tags)") },
        ]);
      } else {
        const errorData = await response.json();
        Alert.alert("Error", errorData.message || "Failed to create pet-tag relation");
      }
    } catch (error) {
      console.error("Error creating pet tag:", error);
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getPetName = (id) => {
    const pet = pets.find((p) => p.id === id);
    return pet ? pet.name : "Select Pet";
  };

  const getTagName = (id) => {
    const tag = tags.find((t) => t.id === id);
    return tag ? tag.name : "Select Tag";
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
      <AdminHeader title="Add Pet Tag" />

      <DetailRow label="Pet" value={
        <TouchableOpacity
        style={adminStyles.pickerContainer}
        onPress={() => setShowPetModal(true)}
        accessibilityLabel="Select pet"
      >
        <Text>{getPetName(petId)}</Text>
        </TouchableOpacity>
      }/>

      <Modal
        visible={showPetModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPetModal(false)}
      >
        <View style={modalStyles.modalOverlay}>
          <View style={modalStyles.modalContent}>
            <FlatList
              data={pets}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    setPetId(item.id);
                    setShowPetModal(false);
                  }}
                  style={modalStyles.modalItem}
                  accessibilityLabel={`Select ${item.name}`}
                >
                  <Text>{item.name}</Text>
                </Pressable>
              )}
            />
            <TouchableOpacity
              onPress={() => setShowPetModal(false)}
              style={modalStyles.modalCloseButton}
              accessibilityLabel="Close pet selection"
            >
              <Text style={{ color: COLORS.primary }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <DetailRow label="Tag" value={
        <TouchableOpacity
        style={adminStyles.pickerContainer}
        onPress={() => setShowTagModal(true)}
        accessibilityLabel="Select tag"
      >
        <Text>{getTagName(tagId)}</Text>
      </TouchableOpacity>
      }/>

      <Modal
        visible={showTagModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTagModal(false)}
      >
        <View style={modalStyles.modalOverlay}>
          <View style={modalStyles.modalContent}>
            <FlatList
              data={tags}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    setTagId(item.id);
                    setShowTagModal(false);
                  }}
                  style={modalStyles.modalItem}
                  accessibilityLabel={`Select ${item.name}`}
                >
                  <Text>{item.name}</Text>
                </Pressable>
              )}
            />
            <TouchableOpacity
              onPress={() => setShowTagModal(false)}
              style={modalStyles.modalCloseButton}
              accessibilityLabel="Close tag selection"
            >
              <Text style={{ color: COLORS.primary }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TouchableOpacity
        style={adminStyles.mainButton}
        onPress={handleSubmit}
        disabled={loading}
        accessibilityLabel="Add pet tag"
      >
        {loading ? (
          <ActivityIndicator size="small" color={COLORS.white} />
        ) : (
          <Text style={adminStyles.mainButtonText}>Add</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[adminStyles.mainButton, { marginTop: 10 }]}
        onPress={() => router.push("/(admin)/(pet-tags)")}
        disabled={loading}
        accessibilityLabel="Cancel"
      >
        <Text style={adminStyles.mainButtonText}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
