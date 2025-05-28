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
import FormField from "../(components)/FormField";
import COLORS from "../../../constants/colors";
import DetailRow from "../../../components/DetailRow";

export default function CreateAdoptionRequest() {
  const [petId, setPetId] = useState("");
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");
  const [isApproved, setIsApproved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [pets, setPets] = useState([]);
  const [users, setUsers] = useState([]);
  const [showPetModal, setShowPetModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchRequiredData = async () => {
      try {
        setFetchingData(true);
        const token = await AsyncStorage.getItem("userToken");

        const petsResponse = await fetch("http://10.0.2.2:5000/api/Pet", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const usersResponse = await fetch("http://10.0.2.2:5000/api/auth/Users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (petsResponse.ok && usersResponse.ok) {
          const petsData = await petsResponse.json();
          const usersData = await usersResponse.json();

          const processedPets = petsData.map((pet) => ({
            ...pet,
            id: String(pet.id),
          }));

          const processedUsers = usersData.map((user) => ({
            ...user,
            id: String(user.id),
          }));

          setPets(processedPets);
          setUsers(processedUsers);

          if (processedPets.length > 0) setPetId(processedPets[0].id);
          if (processedUsers.length > 0) setUserId(processedUsers[0].id);
        } else {
          Alert.alert("Error", "Failed to load required data");
        }
      } catch (error) {
        Alert.alert("Error", "An unexpected error occurred while loading data");
      } finally {
        setFetchingData(false);
      }
    };

    fetchRequiredData();
  }, []);

  const handleSubmit = async () => {
    if (!petId || !userId) {
      Alert.alert("Error", "Pet and User are required");
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");

      const adoptionData = {
        petId: Number(petId),
        userId: Number(userId),
        message: message.trim() || null,
        requestDate: new Date().toISOString(),
        isApproved,
      };

      const response = await fetch("http://10.0.2.2:5000/api/AdoptionRequest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(adoptionData),
      });

      if (response.ok) {
        Alert.alert("Success", "Adoption request created successfully", [
          {
            text: "OK",
            onPress: () => router.push("/(admin)/(adoption-requests)"),
          },
        ]);
      } else {
        const text = await response.text();
        let errorMessage = "Failed to create adoption request";
        try {
          if (text) {
            const errorData = JSON.parse(text);
            errorMessage = errorData.message || errorMessage;
          }
        } catch (e) {}
        Alert.alert("Error", errorMessage);
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getPetName = (id) => {
    const pet = pets.find((p) => p.id === id);
    return pet ? pet.name : "Select Pet";
  };

  const getUserName = (id) => {
    const user = users.find((u) => u.id === id);
    return user ? `${user.firstName} ${user.lastName}` : "Select User";
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
      <AdminHeader title="Create Adoption Request" />

      <DetailRow
        label="Pet"
        value={
          <TouchableOpacity
            style={adminStyles.pickerContainer}
            onPress={() => setShowPetModal(true)}
            accessibilityLabel="Select pet"
          >
            <Text>{getPetName(petId)}</Text>
          </TouchableOpacity>
        }
      />
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
              ListEmptyComponent={
                <Text style={{ padding: 20, textAlign: "center" }}>
                  No pets available
                </Text>
              }
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

      <DetailRow
        label="User"
        value={
          <TouchableOpacity
            style={adminStyles.pickerContainer}
            onPress={() => setShowUserModal(true)}
            accessibilityLabel="Select user"
          >
            <Text>{getUserName(userId)}</Text>
          </TouchableOpacity>
        }
      />
      <Modal
        visible={showUserModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowUserModal(false)}
      >
        <View style={modalStyles.modalOverlay}>
          <View style={modalStyles.modalContent}>
            <FlatList
              data={users}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    setUserId(item.id);
                    setShowUserModal(false);
                  }}
                  style={modalStyles.modalItem}
                  accessibilityLabel={`Select ${item.firstName} ${item.lastName}`}
                >
                  <Text>
                    {item.firstName} {item.lastName}
                  </Text>
                </Pressable>
              )}
              ListEmptyComponent={
                <Text style={{ padding: 20, textAlign: "center" }}>
                  No users available
                </Text>
              }
            />
            <TouchableOpacity
              onPress={() => setShowUserModal(false)}
              style={modalStyles.modalCloseButton}
              accessibilityLabel="Close user selection"
            >
              <Text style={{ color: COLORS.primary }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <FormField
        label="Message (optional)"
        value={message}
        onChangeText={setMessage}
        placeholder="Enter message"
        iconName="chatbox-outline"
        multiline={true}
        numberOfLines={4}
      />

      <DetailRow
        label="Approved"
        value={
          <TouchableOpacity
            style={[adminStyles.checkboxContainer, { marginLeft: -8 }]}
            onPress={() => setIsApproved((prev) => !prev)}
            accessibilityLabel="Toggle approval status"
          >
            <View style={adminStyles.checkbox}>
              {isApproved && <View style={adminStyles.checkboxInner} />}
            </View>
            <Text style={adminStyles.checkboxLabel}>Approved</Text>
          </TouchableOpacity>
        }
      />

      <TouchableOpacity
        style={adminStyles.mainButton}
        onPress={handleSubmit}
        disabled={loading}
        accessibilityLabel="Create adoption request"
      >
        {loading ? (
          <ActivityIndicator size="small" color={COLORS.white} />
        ) : (
          <Text style={adminStyles.mainButtonText}>Create Adoption Request</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[adminStyles.mainButton, { marginTop: 10 }]}
        onPress={() => router.push("/(admin)/(adoption-requests)")}
        disabled={loading}
        accessibilityLabel="Cancel"
      >
        <Text style={adminStyles.mainButtonText}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
