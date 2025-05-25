import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  Image,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import * as ImagePicker from "expo-image-picker";
import styles from "../../../../assets/styles/main.styles";
import adminStyles from "../../../../assets/styles/admin.styles";
import AdminHeader from "../../(components)/AdminHeader";
import FormField from "../../(components)/FormField";
import COLORS from "../../../../constants/colors";

export default function EditUser() {
  const { id } = useLocalSearchParams();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState("0");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [login, setLogin] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [profilePictureURL, setProfilePictureURL] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem("userToken");
        const response = await fetch(
          `http://10.0.2.2:5000/api/auth/user/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.ok) {
          const user = await response.json();
          setFirstName(user.firstName);
          setLastName(user.lastName);
          setEmail(user.email);
          setUserType(user.userType?.toString() || "0");
          setAddress(user.address || "");
          setCity(user.city || "");
          setCountry(user.country || "");
          setLogin(user.login);
          setPhoneNumber(user.phoneNumber || "");
          setPostalCode(user.postalCode || "");
          setProfilePictureURL(user.profilePictureURL || "");
        } else {
          Alert.alert("Error", "Failed to load user details");
          router.back();
        }
      } catch {
        Alert.alert("Error", "An unexpected error occurred");
        router.back();
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled && result.assets.length > 0) {
      setProfilePictureURL(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!firstName || !lastName || !email || !login || !profilePictureURL) {
      Alert.alert("Error", "All required fields must be filled");
      return;
    }
    try {
      setSaving(true);
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(`http://10.0.2.2:5000/api/auth/edit/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id,
          firstName,
          lastName,
          email,
          userType: parseInt(userType, 10),
          address,
          city,
          country,
          login,
          phoneNumber,
          postalCode,
          profilePictureURL,
        }),
      });
      if (response.ok) {
        Alert.alert("Success", "User updated", [
          { text: "OK", onPress: () => router.push(`/users/${id}`) },
        ]);
      } else {
        Alert.alert("Error", "Failed to update user");
      }
    } catch {
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setSaving(false);
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
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <AdminHeader title="Edit User" />
        <FormField
          label="First Name"
          value={firstName}
          onChangeText={setFirstName}
          placeholder="Enter first name"
          iconName="person-outline"
        />
        <FormField
          label="Last Name"
          value={lastName}
          onChangeText={setLastName}
          placeholder="Enter last name"
          iconName="person-outline"
        />
        <FormField
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="Enter email"
          iconName="mail-outline"
          keyboardType="email-address"
        />
        <FormField
          label="Login"
          value={login}
          onChangeText={setLogin}
          placeholder="Enter login"
          iconName="person-circle-outline"
        />
        <FormField
          label="User Type"
          value={userType}
          onChangeText={setUserType}
          placeholder="Enter user type (number)"
          iconName="people-outline"
          keyboardType="numeric"
        />
        <FormField
          label="Address"
          value={address}
          onChangeText={setAddress}
          placeholder="Enter address"
          iconName="home-outline"
        />
        <FormField
          label="City"
          value={city}
          onChangeText={setCity}
          placeholder="Enter city"
          iconName="business-outline"
        />
        <FormField
          label="Country"
          value={country}
          onChangeText={setCountry}
          placeholder="Enter country"
          iconName="flag-outline"
        />
        <FormField
          label="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="Enter phone number"
          iconName="call-outline"
          keyboardType="phone-pad"
        />
        <FormField
          label="Postal Code"
          value={postalCode}
          onChangeText={setPostalCode}
          placeholder="Enter postal code"
          iconName="mail-open-outline"
        />
        <TouchableOpacity
          style={styles.imagePickerButton}
          onPress={handleImagePick}
        >
          <Text style={styles.buttonText}>Pick Profile Picture</Text>
        </TouchableOpacity>
        {profilePictureURL ? (
          <Image
            source={{ uri: profilePictureURL }}
            style={{
              width: 100,
              height: 100,
              marginVertical: 10,
              borderRadius: 8,
            }}
          />
        ) : null}
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={saving}
        >
          <Text style={styles.buttonText}>Update User</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[adminStyles.mainButton, { marginTop: 10 }]}
          onPress={() => router.push(`/(admin)/(users)`)}
          disabled={saving}
        >
          <Text style={adminStyles.mainButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
