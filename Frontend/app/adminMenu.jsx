import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import styles from "../assets/styles/main.styles";
import adminStyles from "../assets/styles/admin.styles";
import { Image } from "expo-image";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../constants/colors";

export default function AdminMenu() {
  const [user, setUser] = useState({ firstName: "", lastName: "" });
  const router = useRouter();
  const menuItems = [
    {
      title: "Pet Types",
      icon: "paw",
      dataRoute: "api/PetType",
      finalDestination: "/(admin)/(pet-types)/",
      description: "Manage animal types",
    },
    {
      title: "Breeds",
      icon: "list",
      dataRoute: "api/Breed",
      finalDestination: "/(admin)/(breeds)",
      description: "Manage pet breeds",
    },
    {
      title: "Pets",
      icon: "paw-outline",
      dataRoute: "api/Pet",
      finalDestination: "/(admin)/(pets)/",
      description: "Manage pet listings",
    },
    {
      title: "Health Records",
      icon: "medkit",
      dataRoute: "api/HealthRecord",
      finalDestination: "/(admin)/(health-records)",
      description: "Manage health records",
    },
    {
      title: "Adoption Requests",
      icon: "heart",
      dataRoute: "api/AdoptionRequest",
      finalDestination: "/(admin)/(adoption-requests)",
      description: "Manage adoption applications",
    },
    {
      title: "Tags",
      icon: "pricetag",
      dataRoute: "api/Tag",
      finalDestination: "/(admin)/(tags)",
      description: "Manage pet tags",
    },
    {
      title: "Pet Tags",
      icon: "bookmark",
      dataRoute: "api/PetTag",
      finalDestination: "/(admin)/(pet-tags)",
      description: "Manage pet tag assignments",
    },
    {
      title: "Users",
      icon: "people",
      dataRoute: "api/Auth/users",
      finalDestination: "/(admin)/(users)",
      description: "Manage user accounts",
    },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem("userToken");

      if (!token) return;

      try {
        const decoded = jwtDecode(token);
        setUser({
          firstName: decoded.firstName || "",
          lastName: decoded.lastName || "",
        });
      } catch (ex) {
        setUser({ firstName: "", lastName: "" });
      }
    };

    fetchUser();
  }, []);

  const handleRedirect = async (item) => {
    try {
      const token = await AsyncStorage.getItem("userToken");

      if (!token) {
        Alert.alert("Error!", "No token found. Please log in again.");
        router.push("/login");
        return;
      }

      console.log("przekierowanie na:", item.finalDestination);
      console.log("Prubuję wziąść dane z :", item.dataRoute);
      const response = await fetch(`http://10.0.2.2:5000/${item.dataRoute}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(`Status: ${response.status}, OK: ${response.ok}`);

      if (!response.ok) {
        Alert.alert("Error!", "Failed to retrieve data.");
        return;
      }

      console.log("Dane pochodzą z:", item.dataRoute);
      const data = await response.json();
      console.log("Response data:", data);

      router.push(item.finalDestination);
    } catch (error) {
      console.error("Error details:", error);
      Alert.alert("Error!", error.message || "Unknown error.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topIllustration}>
        <Text style={styles.title}>
          Welcome {user.firstName} {user.lastName}!
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
            <View style={adminStyles.menuItemRow}>
              <Ionicons name={item.icon} size={36} color={COLORS.primary} />
              <View style={adminStyles.menuItemTextContainer}>
                <Text style={styles.adminMenuItemTitle}>{item.title}</Text>
                <Text style={styles.adminMenuItemDescription}>
                  {item.description}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: COLORS.primary, marginTop: 20 },
        ]}
        onPress={() => router.push("/mainMenu")}
      >
        <Text style={styles.buttonText}>Back to Main Menu</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
