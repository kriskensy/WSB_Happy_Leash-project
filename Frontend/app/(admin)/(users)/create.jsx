import { useState } from "react";
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

export default function CreateUser() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState(1); //1 = normal user
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [login, setLogin] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [postalCode, setPostalCode] = useState("");
  // const [profilePictureURL, setProfilePictureURL] = useState("");
  const [loading, setLoading] = useState(false);
  const [showUserTypeModal, setShowUserTypeModal] = useState(false);
  
  const router = useRouter();

  // User type options
  const userTypes = [
    { id: 0, name: "Admin" },
    { id: 1, name: "User" },
    { id: 2, name: "Guest" },
  ];

  //TODO do ogarnięcia image

  // const handleImagePick = async () => {
  //   try {
  //     const result = await ImagePicker.launchImageLibraryAsync({
  //       mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //       allowsEditing: true,
  //       quality: 1,
  //     });
      
  //     if (!result.canceled && result.assets && result.assets.length > 0) {
  //       setProfilePictureURL(result.assets[0].uri);
  //     }
  //   } catch (error) {
  //     console.error("Error picking image:", error);
  //     Alert.alert("Error", "Could not select image");
  //   }
  // };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    if (!firstName || !lastName || !email || !password || !login) {
      Alert.alert("Error", "First Name, Last Name, Email, Password, and Login are required");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");
      
      const userData = {
        firstName,
        lastName,
        email,
        passwordHash: password,
        userType: Number(userType),
        login,
        address: address || null,
        city: city || null,
        country: country || null,
        phoneNumber: phoneNumber || null,
        postalCode: postalCode || null,
        // profilePictureURL: profilePictureURL || null,
      };
      
      const response = await fetch("http://10.0.2.2:5000/api/User", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });
      
      if (response.ok) {
        Alert.alert("Success", "User created successfully", [
          { text: "OK", onPress: () => router.push("/(admin)/(users)") },
        ]);
      } else {
        const errorData = await response.text();
        Alert.alert("Error", errorData.message || "Failed to create user");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getUserTypeName = (id) => {
    const type = userTypes.find(t => t.id === id);
    return type ? type.name : "Select User Type";
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <AdminHeader title="Create User" />
        
        <FormField
          label="First Name *"
          value={firstName}
          onChangeText={setFirstName}
          placeholder="Enter first name"
          iconName="person-outline"
        />
        
        <FormField
          label="Last Name *"
          value={lastName}
          onChangeText={setLastName}
          placeholder="Enter last name"
          iconName="person-outline"
        />
        
        <FormField
          label="Email *"
          value={email}
          onChangeText={setEmail}
          placeholder="Enter email"
          iconName="mail-outline"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <FormField
          label="Login *"
          value={login}
          onChangeText={setLogin}
          placeholder="Enter login"
          iconName="person-circle-outline"
          autoCapitalize="none"
        />
        
        <FormField
          label="Password *"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter password"
          iconName="lock-closed-outline"
          secureTextEntry={true}
        />
        
        <Text style={styles.pickerLabel}>User Type *</Text>
        <TouchableOpacity
          style={styles.pickerContainer}
          onPress={() => setShowUserTypeModal(true)}
          accessibilityLabel="Select user type"
          accessible
        >
          <Text>{getUserTypeName(userType)}</Text>
        </TouchableOpacity>
        
        <Modal
          visible={showUserTypeModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowUserTypeModal(false)}
        >
          <View style={modalStyles.modalOverlay}>
            <View style={modalStyles.modalContent}>
              <FlatList
                data={userTypes}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => {
                      setUserType(item.id);
                      setShowUserTypeModal(false);
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
                onPress={() => setShowUserTypeModal(false)}
                style={modalStyles.modalCloseButton}
                accessibilityLabel="Close user type selection"
                accessible
              >
                <Text style={{ color: COLORS.primary }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        
        <Text style={{marginTop: 20, marginBottom: 10, fontWeight: 'bold'}}>Optional Information</Text>
        
        <FormField
          label="Address"
          value={address}
          onChangeText={setAddress}
          placeholder="Enter address (optional)"
          iconName="home-outline"
        />
        
        <FormField
          label="City"
          value={city}
          onChangeText={setCity}
          placeholder="Enter city (optional)"
          iconName="business-outline"
        />
        
        <FormField
          label="Country"
          value={country}
          onChangeText={setCountry}
          placeholder="Enter country (optional)"
          iconName="flag-outline"
        />
        
        <FormField
          label="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="Enter phone number (optional)"
          iconName="call-outline"
          keyboardType="phone-pad"
        />
        
        <FormField
          label="Postal Code"
          value={postalCode}
          onChangeText={setPostalCode}
          placeholder="Enter postal code (optional)"
          iconName="mail-open-outline"
        />
        
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={loading}
          accessibilityLabel="Create user"
          accessible
        >
          {loading ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <Text style={styles.buttonText}>Create User</Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity
          style={adminStyles.mainButton}
          onPress={() => router.push("/(admin)/(users)")}
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
