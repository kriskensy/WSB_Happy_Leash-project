import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import styles from "../assets/styles/main.styles";
import { Image } from "expo-image";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../constants/colors";
 
export default function AdminMenu() {
  const [token, setToken] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const router = useRouter();
  const menuItems = [
    {
      title: "Pet Types",
      icon: "paw",
      dataRoute: "api/PetType",
      finalDestination: "/pet-types",
      description: "Manage animal types",
    },
    {
      title: "Breeds",
      icon: "list",
      dataRoute: "api/Breed",
      finalDestination: "/breeds", 
      description: "Manage pet breeds",
    },
    {
      title: "Pets",
      icon: "paw-outline",
      dataRoute: "api/Pet",
      finalDestination: "/pets",
      description: "Manage pet listings",
    },
    {
      title: "Health Records",
      icon: "medkit",
      dataRoute: "api/HealthRecord",
      finalDestination: "/health-records",
      description: "Manage health records",
    },
    {
      title: "Adoption Requests",
      icon: "heart",
      dataRoute: "api/AdoptionRequest",
      finalDestination: "/adoption-requests",
      description: "Manage adoption applications",
    },
    {
      title: "Tags",
      icon: "pricetag",
      dataRoute: "api/Tag",
      finalDestination: "/tags",
      description: "Manage pet tags",
    },
    {
      title: "Pet Tags",
      icon: "bookmark",
      dataRoute: "api/PetTag",
      finalDestination: "/pet-tags",
      description: "Manage pet tag assignments",
    },
    {
      title: "Users",
      icon: "people",
      dataRoute: "api/User",
      finalDestination: "/users",
      description: "Manage user accounts",
    },
  ];
 
const handleRedirect = async (item) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    
    console.log("Próbuję przekierować na:", item.finalDestination);
    
    const response = await fetch(`http://10.0.2.2:5000/${item.dataRoute}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    
    console.log(`Status: ${response.status}, OK: ${response.ok}`);
    
    if (!response.ok) {
      Alert.alert("Błąd", "Nie udało się pobrać danych");
      return;
    }
    
    const data = await response.json();
    console.log("Response data:", data);
    
    //nawigacja dopiero po pobraniu danych
    // router.push(item.finalDestination || "/");
  } catch (error) {
    console.error("Error details:", error);
    Alert.alert("Błąd", error.message || "Nieznany błąd.");
  }
};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topIllustration}>
        <Text style={styles.title}>
          Welcome {firstName} {lastName}!
        </Text>
        <Image
          source={require("../assets/images/AdminPanelImage.png")}
          style={styles.illustrationImage}
        />
        <Text style={styles.title}>Admin Dashboard</Text>
      </View>
 
      <View style={styles.adminMenuGrid}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.adminMenuItem}
            onPress={() => handleRedirect(item)}
          >
            <Ionicons name={item.icon} size={32} color={COLORS.primary} />
            <Text style={styles.adminMenuItemTitle}>{item.title}</Text>
            <Text style={styles.adminMenuItemDescription}>
              {item.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
 
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: COLORS.secondary, marginTop: 20 },
        ]}
        onPress={() => router.push("/")}
      >
        <Text style={styles.buttonText}>Back to Main Menu</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};