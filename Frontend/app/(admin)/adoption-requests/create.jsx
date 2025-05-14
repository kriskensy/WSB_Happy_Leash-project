import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Picker } from "@react-native-picker/picker";
import styles from "../../../assets/styles/main.styles";
import AdminHeader from "../components/AdminHeader";
import FormField from "../components/FormField";
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
          setPets(petsData);
          setUsers(usersData);
          
          //ustawia wartości początkowe
          if (petsData.length > 0) setPetId(petsData[0].id);
          if (usersData.length > 0) setUserId(usersData[0].id);
        } else {
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
    if (!petId || !userId) {
      Alert.alert("Error", "Pet and User are required");
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch("http://10.0.2.2:5000/api/AdoptionRequest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          petId,
          userId,
          message,
          requestDate: new Date().toISOString(),
          isApproved
        }),
      });

      if (response.ok) {
        Alert.alert("Success", "Adoption request created successfully", [
          { text: "OK", onPress: () => router.push("/adoption-requests") }
        ]);
      } else {
        const errorData = await response.json();
        Alert.alert("Error", errorData.message || "Failed to create adoption request");
      }
    } catch (error) {
      console.error("Error creating adoption request:", error);
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
        <AdminHeader title="Create Adoption Request" />
        
        <Text style={styles.pickerLabel}>Pet:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={petId}
            onValueChange={(itemValue) => setPetId(itemValue)}
            style={styles.picker}
          >
            {pets.map((pet) => (
              <Picker.Item key={pet.id} label={pet.name} value={pet.id} />
            ))}
          </Picker>
        </View>
        
        <Text style={styles.pickerLabel}>User:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={userId}
            onValueChange={(itemValue) => setUserId(itemValue)}
            style={styles.picker}
          >
            {users.map((user) => (
              <Picker.Item 
                key={user.id} 
                label={`${user.firstName} ${user.lastName}`} 
                value={user.id} 
              />
            ))}
          </Picker>
        </View>
        
        <FormField
          label="Message"
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
          >
            {isApproved && <View style={styles.checkboxInner} />}
          </TouchableOpacity>
          <Text style={styles.checkboxLabel}>Approved</Text>
        </View>
        
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <Text style={styles.buttonText}>Create Adoption Request</Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, { backgroundColor: COLORS.secondary, marginTop: 10 }]}
          onPress={() => router.push("/adoption-requests")}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
