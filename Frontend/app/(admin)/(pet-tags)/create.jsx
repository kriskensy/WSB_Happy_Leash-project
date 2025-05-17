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
import styles from "../../../assets/styles/main.styles";
import adminStyles from "../../../assets/styles/admin.styles";
import modalStyles from "../../../assets/styles/modal.styles";
import AdminHeader from "../(components)/AdminHeader";
import COLORS from "../../../constants/colors";

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

          
          const processedPets = petsData.map((pet) => ({
            ...pet,
            id: Number(pet.id),
          }));
          const processedTags = tagsData.map((tag) => ({
            ...tag,
            id: Number(tag.id),
          }));

          setPets(processedPets);
          setTags(processedTags);

          if (processedPets.length > 0) setPetId(processedPets[0].id);
          if (processedTags.length > 0) setTagId(processedTags[0].id);
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
        petId: Number(petId),
        tagId: Number(tagId),
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
    const pet = pets.find((p) => Number(p.id) === Number(id));
    return pet ? pet.name : "Select Pet";
  };

  const getTagName = (id) => {
    const tag = tags.find((t) => Number(t.id) === Number(id));
    return tag ? tag.name : "Select Tag";
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
        <TouchableOpacity
          style={styles.pickerContainer}
          onPress={() => setShowPetModal(true)}
          accessibilityLabel="Select pet"
          accessible
        >
          <Text>{getPetName(petId)}</Text>
        </TouchableOpacity>
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
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => {
                      setPetId(item.id);
                      setShowPetModal(false);
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
                onPress={() => setShowPetModal(false)}
                style={modalStyles.modalCloseButton}
                accessibilityLabel="Close pet selection"
                accessible
              >
                <Text style={{ color: COLORS.primary }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Text style={styles.pickerLabel}>Tag:</Text>
        <TouchableOpacity
          style={styles.pickerContainer}
          onPress={() => setShowTagModal(true)}
          accessibilityLabel="Select tag"
          accessible
        >
          <Text>{getTagName(tagId)}</Text>
        </TouchableOpacity>
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
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => {
                      setTagId(item.id);
                      setShowTagModal(false);
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
                onPress={() => setShowTagModal(false)}
                style={modalStyles.modalCloseButton}
                accessibilityLabel="Close tag selection"
                accessible
              >
                <Text style={{ color: COLORS.primary }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={loading}
          accessibilityLabel="Add pet tag"
          accessible
        >
          {loading ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <Text style={styles.buttonText}>Add</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={adminStyles.mainButton}
          onPress={() => router.push("/(admin)/(pet-tags)")}
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
