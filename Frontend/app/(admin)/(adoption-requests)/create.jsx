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
import FormField from "../(components)/FormField";
import COLORS from "../../../constants/colors";

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

        // Fetch pets
        const petsResponse = await fetch("http://10.0.2.2:5000/api/Pet", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Fetch users
        const usersResponse = await fetch("http://10.0.2.2:5000/api/User", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (petsResponse.ok && usersResponse.ok) {
          const petsData = await petsResponse.json();
          const usersData = await usersResponse.json();
          
          const processedPets = petsData.map(pet => ({
            ...pet,
            id: Number(pet.id)
          }));
          
          const processedUsers = usersData.map(user => ({
            ...user,
            id: Number(user.id)
          }));
          
          setPets(processedPets);
          setUsers(processedUsers);

          if (processedPets.length > 0) setPetId(processedPets[0].id);
          if (processedUsers.length > 0) setUserId(processedUsers[0].id);
        } else {
          const petErrorText = await petsResponse.text();
          const userErrorText = await usersResponse.text();
          console.log("Error fetching pets:", petErrorText);
          console.log("Error fetching users:", userErrorText);
          Alert.alert("Error", "Failed to load required data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        Alert.alert("Error", "An unexpected error occurred while loading data");
      } finally {
        setFetchingData(false);
      }
    };

    fetchRequiredData();
  }, []);

  const handleSubmit = async () => {
    if (
      petId === undefined || 
      petId === null ||
      petId === "" ||
      userId === undefined || 
      userId === null || 
      userId === "") {
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
        isApproved
      };
      
      console.log("Submitting adoption request:", adoptionData);
      
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
          { text: "OK", onPress: () => router.push("/(admin)/(adoption-requests)") },
        ]);
      } else {

        const text = await response.text();
        let errorMessage = "Failed to create adoption request";
        try {
          if (text) {
            const errorData = JSON.parse(text);
            errorMessage = errorData.message || errorMessage;
          }
        } catch (e) {
          console.error("Error parsing error response:", e);
        }
        Alert.alert("Error", errorMessage);
      }
    } catch (error) {
      console.error("Error creating adoption request:", error);
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getPetName = (id) => {
    const pet = pets.find(p => Number(p.id) === Number(id));
    return pet ? pet.name : "Select Pet";
  };

  const getUserName = (id) => {
    const user = users.find(u => Number(u.id) === Number(id));
    return user ? `${user.firstName} ${user.lastName}` : "Select User";
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
        <AdminHeader title="Create Adoption Request" />

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
                ListEmptyComponent={
                  <Text style={{ padding: 20, textAlign: 'center' }}>No pets available</Text>
                }
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

        <Text style={styles.pickerLabel}>User:</Text>
        <TouchableOpacity
          style={styles.pickerContainer}
          onPress={() => setShowUserModal(true)}
          accessibilityLabel="Select user"
          accessible
        >
          <Text>{getUserName(userId)}</Text>
        </TouchableOpacity>
        
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
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => {
                      setUserId(item.id);
                      setShowUserModal(false);
                    }}
                    style={modalStyles.modalItem}
                    accessibilityLabel={`Select ${item.firstName} ${item.lastName}`}
                    accessible
                  >
                    <Text>{item.firstName} {item.lastName}</Text>
                  </Pressable>
                )}
                ListEmptyComponent={
                  <Text style={{ padding: 20, textAlign: 'center' }}>No users available</Text>
                }
              />
              <TouchableOpacity
                onPress={() => setShowUserModal(false)}
                style={modalStyles.modalCloseButton}
                accessibilityLabel="Close user selection"
                accessible
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

        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => setIsApproved(!isApproved)}
            accessibilityLabel="Toggle approval status"
            accessible
          >
            {isApproved && <View style={styles.checkboxInner} />}
          </TouchableOpacity>
          <Text style={styles.checkboxLabel}>Approved</Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={loading}
          accessibilityLabel="Create adoption request"
          accessible
        >
          {loading ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <Text style={styles.buttonText}>Create Adoption Request</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={adminStyles.mainButton}
          onPress={() => router.push("/(admin)/(adoption-requests)")}
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
