import { useState } from "react";
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, ScrollView, Image } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import * as ImagePicker from "expo-image-picker";
import styles from "../../../assets/styles/main.styles";
import AdminHeader from "../components/AdminHeader";
import FormField from "../components/FormField";
import COLORS from "../../../constants/colors";

export default function CreateUser() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("0");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [login, setLogin] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [profilePictureURL, setProfilePictureURL] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, quality: 1 });
    if (!result.canceled && result.assets.length > 0) {
      setProfilePictureURL(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!firstName || !lastName || !email || !password || !login || !profilePictureURL) {
      Alert.alert("Error", "All required fields must be filled");
      return;
    }
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch("http://10.0.2.2:5000/api/User", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          passwordHash: password,
          userType: parseInt(userType, 10),
          address,
          city,
          country,
          login,
          phoneNumber,
          postalCode,
          profilePictureURL
        }),
      });
      if (response.ok) {
        Alert.alert("Success", "User created successfully", [
          { text: "OK", onPress: () => router.push("/users") }
        ]);
      } else {
        Alert.alert("Error", "Failed to create user");
      }
    } catch {
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <AdminHeader title="Create User" />
        <FormField label="First Name" value={firstName} onChangeText={setFirstName} placeholder="Enter first name" iconName="person-outline" />
        <FormField label="Last Name" value={lastName} onChangeText={setLastName} placeholder="Enter last name" iconName="person-outline" />
        <FormField label="Email" value={email} onChangeText={setEmail} placeholder="Enter email" iconName="mail-outline" keyboardType="email-address" />
        <FormField label="Login" value={login} onChangeText={setLogin} placeholder="Enter login" iconName="person-circle-outline" />
        <FormField label="Password" value={password} onChangeText={setPassword} placeholder="Enter password" iconName="lock-closed-outline" secureTextEntry={true} />
        <FormField label="User Type" value={userType} onChangeText={setUserType} placeholder="Enter user type (number)" iconName="people-outline" keyboardType="numeric" />
        <FormField label="Address" value={address} onChangeText={setAddress} placeholder="Enter address" iconName="home-outline" />
        <FormField label="City" value={city} onChangeText={setCity} placeholder="Enter city" iconName="business-outline" />
        <FormField label="Country" value={country} onChangeText={setCountry} placeholder="Enter country" iconName="flag-outline" />
        <FormField label="Phone Number" value={phoneNumber} onChangeText={setPhoneNumber} placeholder="Enter phone number" iconName="call-outline" keyboardType="phone-pad" />
        <FormField label="Postal Code" value={postalCode} onChangeText={setPostalCode} placeholder="Enter postal code" iconName="mail-open-outline" />
        <TouchableOpacity style={styles.imagePickerButton} onPress={handleImagePick}>
          <Text style={styles.buttonText}>Pick Profile Picture</Text>
        </TouchableOpacity>
        {profilePictureURL ? <Image source={{ uri: profilePictureURL }} style={{ width: 100, height: 100, marginVertical: 10, borderRadius: 8 }} /> : null}
        <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
          <Text style={styles.buttonText}>Create User</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: COLORS.secondary, marginTop: 10 }]} onPress={() => router.push("/users")} disabled={loading}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
