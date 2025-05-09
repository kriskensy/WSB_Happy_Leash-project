import {
  Alert,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import styles from "../../assets/styles/main.styles";
import { useState } from "react";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";
import { useRouter } from "expo-router";

export default function Register() {
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

  const handleRegister = async () => {
    if (
      !login ||
      !password ||
      !email ||
      !firstName ||
      !lastName ||
      password !== repeatedPassword
    ) {
      Alert.alert(
        "Błąd",
        "Uzupełnij wszystkie wymagane pola i upewnij się, że hasła są takie same."
      );
      return;
    }

    try {
      const formData = new URLSearchParams();
      formData.append("login", login);
      formData.append("password", password);
      formData.append("email", email);
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("phoneNumber", phoneNumber);
      formData.append("address", address);
      formData.append("city", city);
      formData.append("postalCode", postalCode);
      formData.append("country", country);
      formData.append("profilePictureURL", profilePictureURL);

      const response = await fetch("http://10.0.2.2:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Błąd rejestracji", data.message || "Nieznany błąd.");
        return;
      }

      Alert.alert("Sukces", data.message);
      router.push("/login");
    } catch (error) {
      Alert.alert("Błąd", "Nie można połączyć się z serwerem.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topIllustration}>
        <Image
          source={require("../../assets/images/RegisterImage.png")}
          style={styles.illustrationImage}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>First Name</Text>
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

        <Text style={styles.label}>Last Name</Text>
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

        <Text style={styles.label}>Login</Text>
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

        <Text style={styles.label}>Email</Text>
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

        <Text style={styles.label}>Password</Text>
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
            placeholder="Password"
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

        <Text style={styles.label}>Repeat Password</Text>
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
            placeholder="Repeat password"
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

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
