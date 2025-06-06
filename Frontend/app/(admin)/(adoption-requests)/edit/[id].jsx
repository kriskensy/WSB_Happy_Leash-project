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
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import adminStyles from "../../../../assets/styles/admin.styles";
import modalStyles from "../../../../assets/styles/modal.styles";
import AdminHeader from "../../(components)/AdminHeader";
import FormField from "../../(components)/FormField";
import COLORS from "../../../../constants/colors";
import DetailRow from "../../../../components/DetailRow";

export default function EditAdoptionRequest() {
  const { id } = useLocalSearchParams();
  const [petId, setPetId] = useState("");
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");
  const [requestDate, setRequestDate] = useState("");
  const [isApproved, setIsApproved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pets, setPets] = useState([]);
  const [users, setUsers] = useState([]);
  const [showPetModal, setShowPetModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem("userToken");

        const [petsRes, usersRes, adoptionRes] = await Promise.all([
          fetch("http://10.0.2.2:5000/api/Pet", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://10.0.2.2:5000/api/auth/Users", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`http://10.0.2.2:5000/api/AdoptionRequest/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (petsRes.ok && usersRes.ok && adoptionRes.ok) {
          const petsData = await petsRes.json();
          const usersData = await usersRes.json();
          const adoptionData = await adoptionRes.json();

          setPets(petsData);
          setUsers(usersData);

          setPetId(String(adoptionData.petId));
          setUserId(String(adoptionData.userId));
          setMessage(adoptionData.message || "");
          setRequestDate(adoptionData.requestDate);
          setIsApproved(adoptionData.isApproved);
        } else {
          Alert.alert("Error", "Failed to load required data");
          router.back();
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        Alert.alert("Error", "An unexpected error occurred while loading data");
        router.back();
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async () => {
    if (!petId || !userId) {
      Alert.alert("Error", "Pet and User are required");
      return;
    }

    try {
      setSaving(true);
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(
        `http://10.0.2.2:5000/api/AdoptionRequest/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id,
            petId: Number(petId),
            userId: Number(userId),
            message,
            requestDate,
            isApproved,
          }),
        }
      );

      if (response.ok) {
        Alert.alert("Success", "Adoption request updated successfully", [
          {
            text: "OK",
            onPress: () => router.push(`/(admin)/(adoption-requests)`),
          },
        ]);
      } else {
        const errorData = await response.json();
        Alert.alert(
          "Error",
          errorData.message || "Failed to update adoption request"
        );
      }
    } catch (error) {
      console.error("Error updating adoption request:", error);
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  };

  const getPetName = (id) => {
    const pet = pets.find((p) => String(p.id) === String(id));
    return pet ? pet.name : "Select Pet";
  };

  const getUserName = (id) => {
    const user = users.find((u) => String(u.id) === String(id));
    return user ? `${user.firstName} ${user.lastName}` : "Select User";
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
      <AdminHeader title="Edit Adoption Request" />

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
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    setPetId(String(item.id));
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

      <DetailRow label="User" value={
        <TouchableOpacity
        style={adminStyles.pickerContainer}
        onPress={() => setShowUserModal(true)}
        accessibilityLabel="Select user"
      >
        <Text>{getUserName(userId)}</Text>
      </TouchableOpacity>
      }/>
      
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
                    setUserId(String(item.id));
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
        label="Message"
        value={message}
        onChangeText={setMessage}
        placeholder="Enter message"
        iconName="chatbox-outline"
        multiline={true}
        numberOfLines={4}
      />

      <View style={adminStyles.checkboxContainer}>
        <TouchableOpacity
          style={adminStyles.checkbox}
          onPress={() => setIsApproved(!isApproved)}
          accessibilityLabel="Toggle approved"
        >
          {isApproved && <View style={adminStyles.checkboxInner} />}
        </TouchableOpacity>
        <Text style={adminStyles.checkboxLabel}>Approved</Text>
      </View>

      <TouchableOpacity
        style={adminStyles.mainButton}
        onPress={handleSubmit}
        disabled={saving}
        accessibilityLabel="Update adoption request"
      >
        {saving ? (
          <ActivityIndicator size="small" color={COLORS.white} />
        ) : (
          <Text style={adminStyles.mainButtonText}>Update Adoption Request</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[adminStyles.mainButton, { marginTop: 10 }]}
        onPress={() => router.push(`/(admin)/(adoption-requests)`)}
        disabled={saving}
        accessibilityLabel="Cancel"
      >
        <Text style={adminStyles.mainButtonText}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
