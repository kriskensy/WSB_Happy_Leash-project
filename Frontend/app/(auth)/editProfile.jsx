import {
  Alert,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import styles from "../../assets/styles/main.styles";
import { useState, useEffect } from "react";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
 
export default function EditProfile() {
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatedPassword, setRepeatedPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [profilePictureURL, setProfilePictureURL] = useState("");
  const [showPassword, setShowPassword] = useState(false);
 
  const router = useRouter();
 
  //pobranie usera
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("userToken");
        if (storedToken) {
          const decodedToken = jwtDecode(storedToken);
          // console.log("Decoded token:", decodedToken);
 
          setFirstName(decodedToken.firstName);
          setLastName(decodedToken.lastName);
          setLogin(decodedToken.login);
          setEmail(decodedToken.email);
          setPhoneNumber(decodedToken.phoneNumber || "");
          setAddress(decodedToken.address || "");
          setCity(decodedToken.city || "");
          setPostalCode(decodedToken.postalCode || "");
          setCountry(decodedToken.country || "");
          setProfilePictureURL(decodedToken.profilePictureURL || "");
        } else {
          router.replace("/(auth)/login");
          return;
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        Alert.alert("Error", "There was a problem loading the data.");
      } finally {
        setLoading(false);
      }
    };
 
    loadUserData();
  }, []);
 
  const handleUpdateProfile = async () => {
    if (!login || !email || !firstName || !lastName) {
      Alert.alert(
        "Error",
        "Fill in all required fields (first name, last name, login, email)"
      );
      return;
    }
 
    //porównanie czy wpisane hasło jest takie samo jak poprzednie
    if (password && password !== repeatedPassword) {
      Alert.alert("Error", "The passwords are not identical.");
      return;
    }
 
    try {
      setLoading(true);
      const formData = new URLSearchParams();
      formData.append("login", login);
      formData.append("email", email);
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("phoneNumber", phoneNumber);
      formData.append("address", address);
      formData.append("city", city);
      formData.append("postalCode", postalCode);
      formData.append("country", country);
      formData.append("profilePictureURL", profilePictureURL);
 
      //jeśli hasło wpisane to też dołącza
      if (password) {
        formData.append("password", password);
      }
 
      const token = await AsyncStorage.getItem("userToken");
 
      const response = await fetch(
        `http://10.0.2.2:5000/api/auth/edit/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${token}`,
          },
          body: formData.toString(),
        }
      );
 
      const data = await response.json();
 
      if (!response.ok) {
        Alert.alert("Update error", data.message || "Unknown error");
        return;
      }
 
      Alert.alert("Success", "The profile has been successfully updated.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert("Error", "Cannot connect to the server.");
    } finally {
      setLoading(false);
    }
  };
 
  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }
 
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topIllustration}>
        <Text style={styles.title}>Edycja Profilu</Text>
        {profilePictureURL ? (
          <Image
            source={{ uri: profilePictureURL }}
            style={styles.profileImage}
          />
        ) : (
          <Ionicons
            name="person-circle-outline"
            size={120}
            color={COLORS.primary}
          />
        )}
      </View>
 
      <View style={styles.inputGroup}>
        <Text style={styles.label}>First Name *</Text>
        <View style={styles.inputContainer}>
          <Ionicons
            name="person-outline"
            size={20}
            color={COLORS.primary}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="First name"
          />
        </View>
 
        <Text style={styles.label}>Last Name *</Text>
        <View style={styles.inputContainer}>
          <Ionicons
            name="person-outline"
            size={20}
            color={COLORS.primary}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
            placeholder="Last name"
          />
        </View>
 
        <Text style={styles.label}>Login *</Text>
        <View style={styles.inputContainer}>
          <Ionicons
            name="person-circle-outline"
            size={20}
            color={COLORS.primary}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            value={login}
            onChangeText={setLogin}
            placeholder="Login"
          />
        </View>
 
        <Text style={styles.label}>Email *</Text>
        <View style={styles.inputContainer}>
          <Ionicons
            name="mail-outline"
            size={20}
            color={COLORS.primary}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            keyboardType="email-address"
          />
        </View>
 
        <Text style={styles.label}>New Password (optional)</Text>
        <View style={styles.inputContainer}>
          <Ionicons
            name="lock-closed-outline"
            size={20}
            color={COLORS.primary}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Leave empty to keep current"
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={showPassword ? "eye-outline" : "eye-off-outline"}
              size={20}
              color={COLORS.primary}
            />
          </TouchableOpacity>
        </View>
 
        <Text style={styles.label}>Repeat New Password</Text>
        <View style={styles.inputContainer}>
          <Ionicons
            name="lock-closed-outline"
            size={20}
            color={COLORS.primary}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            value={repeatedPassword}
            onChangeText={setRepeatedPassword}
            placeholder="Repeat new password"
            secureTextEntry={!showPassword}
          />
        </View>
 
        <Text style={styles.label}>Phone Number</Text>
        <View style={styles.inputContainer}>
          <Ionicons
            name="call-outline"
            size={20}
            color={COLORS.primary}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="123456789"
            keyboardType="phone-pad"
          />
        </View>
 
        <Text style={styles.label}>Address</Text>
        <View style={styles.inputContainer}>
          <Ionicons
            name="home-outline"
            size={20}
            color={COLORS.primary}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            value={address}
            onChangeText={setAddress}
            placeholder="Address"
          />
        </View>
 
        <Text style={styles.label}>City</Text>
        <View style={styles.inputContainer}>
          <Ionicons
            name="location-outline"
            size={20}
            color={COLORS.primary}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            value={city}
            onChangeText={setCity}
            placeholder="City"
          />
        </View>
 
        <Text style={styles.label}>Postal Code</Text>
        <View style={styles.inputContainer}>
          <Ionicons
            name="document-outline"
            size={20}
            color={COLORS.primary}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            value={postalCode}
            onChangeText={setPostalCode}
            placeholder="00-000"
          />
        </View>
 
        <Text style={styles.label}>Country</Text>
        <View style={styles.inputContainer}>
          <Ionicons
            name="earth-outline"
            size={20}
            color={COLORS.primary}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            value={country}
            onChangeText={setCountry}
            placeholder="Country"
          />
        </View>
 
        <Text style={styles.label}>Profile Picture URL</Text>
        <View style={styles.inputContainer}>
          <Ionicons
            name="image-outline"
            size={20}
            color={COLORS.primary}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            value={profilePictureURL}
            onChangeText={setProfilePictureURL}
            placeholder="https://..."
          />
        </View>
 
        <TouchableOpacity style={styles.button} onPress={handleUpdateProfile}>
          <Text style={styles.buttonText}>Update Profile</Text>
        </TouchableOpacity>
 
        <TouchableOpacity
          style={[styles.button, { backgroundColor: COLORS.secondary }]}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
 
 