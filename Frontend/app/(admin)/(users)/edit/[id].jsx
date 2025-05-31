import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Modal,
  ActivityIndicator,
  ScrollView,
  Image,
  FlatList,
  Pressable,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import styles from "../../../../assets/styles/main.styles";
import adminStyles from "../../../../assets/styles/admin.styles";
import modalStyles from "../../../../assets/styles/modal.styles";
import AdminHeader from "../../(components)/AdminHeader";
import FormField from "../../(components)/FormField";
import COLORS from "../../../../constants/colors";
import DetailRow from "../../../../components/DetailRow";

export default function EditUser() {
  const { id } = useLocalSearchParams();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState(1);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [login, setLogin] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [profilePictureURL, setProfilePictureURL] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showUserTypeModal, setShowUserTypeModal] = useState(false);
  const router = useRouter();

  const userTypes = [
    { id: 0, name: "Admin" },
    { id: 1, name: "User" },
    { id: 2, name: "Guest" },
  ];

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
          setUserType(user.userType ?? 1);
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
      } catch (error) {
        Alert.alert("Error", "An unexpected error occurred: " + error.message);
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
    if (!firstName) {
      Alert.alert("Error", "Name is required");
      return;
    }

    try {
      setSaving(true);
      const token = await AsyncStorage.getItem("userToken");

      const formData = new FormData();
      formData.append("Id", id);
      formData.append("FirstName", firstName);
      formData.append("LastName", lastName);
      formData.append("Email", email);
      formData.append("Login", login);
      formData.append("UserType", userType.toString());
      formData.append("Address", address || "");
      formData.append("City", city || "");
      formData.append("Country", country || "");
      formData.append("PhoneNumber", phoneNumber || "");
      formData.append("PostalCode", postalCode || "");
      formData.append("ProfilePictureURL", profilePictureURL || "");

      if (profilePictureURL && profilePictureURL.startsWith("file://")) {
        const uriParts = profilePictureURL.split(".");
        const fileType = uriParts[uriParts.length - 1];
        formData.append("Picture", {
          uri: profilePictureURL,
          name: `profile.${fileType}`,
          type: `image/${fileType}`,
        });
      }

      const response = await fetch(`http://10.0.2.2:5000/api/auth/edit/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const text = await response.text();
        const data = text ? JSON.parse(text) : {};
        Alert.alert("Success", data.message || "User updated", [
          { text: "OK", onPress: () => router.push("/(admin)/(users)") },
        ]);
      } else {
        const errorText = await response.text();
        const errorData = errorText ? JSON.parse(errorText) : {};
        Alert.alert("Error", errorData.message || "Failed to update user");
      }
    } catch (error) {
      console.error("Error during update user:", error);
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  };

  const getUserTypeName = (id) => {
    const type = userTypes.find((t) => t.id === id);
    return type ? type.name : "Select User Type";
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

        <DetailRow
          label="User Type"
          value={
            <TouchableOpacity
              style={styles.pickerContainer}
              onPress={() => setShowUserTypeModal(true)}
            >
              <Text>{getUserTypeName(userType)}</Text>
            </TouchableOpacity>
          }
        />

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
                  >
                    <Text>{item.name}</Text>
                  </Pressable>
                )}
              />
              <TouchableOpacity
                onPress={() => setShowUserTypeModal(false)}
                style={modalStyles.modalCloseButton}
              >
                <Text style={{ color: COLORS.primary }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

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

        {profilePictureURL ? (
          <Image
            source={{
              uri: profilePictureURL.startsWith("file://")
                ? profilePictureURL
                : `http://10.0.2.2:5000${profilePictureURL}`,
            }}
            style={{
              width: 100,
              height: 100,
              marginVertical: 10,
              borderRadius: 8,
            }}
          />
        ) : null}

        <TouchableOpacity
          style={adminStyles.mainButton}
          onPress={handleImagePick}
          accessibilityLabel="Pick Profile Image"
        >
          <Text style={adminStyles.mainButtonText}>Pick Profile Image</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={saving}
        >
          <Text style={styles.buttonText}>Update User</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[adminStyles.mainButton, { marginTop: 10 }]}
          onPress={() => router.push("/(admin)/(users)")}
          disabled={saving}
        >
          <Text style={adminStyles.mainButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
