import { View, Text, TextInput, TouchableOpacity } from "react-native";
import styles from "../../assets/styles/main.styles";
import { useState } from "react";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repetedPassword, setRepitedPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  return (
    <View style={styles.container}>
      <View style={styles.topIllustration}>
        <Image
          source={require("../../assets/images/RegisterImage.png")}
          style={styles.illustrationImage}
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Your Details</Text>
        <View style={styles.inputContainer}>
          <Ionicons
            name="person-sharp"
            size={20}
            color={COLORS.primary}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            placeholderTextColor={COLORS.placeholderText}
            value={fullName}
            onChangeText={setFullName}
            keyboardType="default"
            autoCapitalize="words"
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
            placeholder="Enter your email"
            placeholderTextColor={COLORS.placeholderText}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
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
            placeholder="Enter your password"
            placeholderTextColor={COLORS.placeholderText}
            value={password}
            onChangeText={setPassword}
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
        <View style={styles.inputContainer}>
          <Ionicons
            name="lock-closed-outline"
            size={20}
            color={COLORS.primary}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Repeat your password"
            placeholderTextColor={COLORS.placeholderText}
            value={repetedPassword}
            onChangeText={setRepitedPassword}
            secureTextEntry={!showPassword}
          />
        </View>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
