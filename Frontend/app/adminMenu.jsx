// import { useEffect, useState } from "react";
// import { View, Text, TouchableOpacity } from "react-native";
// import styles from "../assets/styles/main.styles";
// import { Image } from "expo-image";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { jwtDecode } from "jwt-decode";
// import { useRouter } from "expo-router";

// export default function AdminMenu() {
//   const [token, setToken] = useState(null);
//   const [fristName, setFristName] = useState(false);
//   const [lastName, setLastName] = useState(false);
//   const router = useRouter();

//   const handleMoveToPetListPanel = () => {
//     router.push("/petListPanel");
//   };

//   useEffect(() => {
//     const loadToken = async () => {
//       const storedToken = await AsyncStorage.getItem("userToken");
//       setToken(storedToken);

//       if (storedToken) {
//         try {
//           const decoded = jwtDecode(storedToken);
//           setFristName(decoded.firstName);
//           setLastName(decoded.lastName);
//         } catch (error) {
//           console.log("Błąd dekodowania tokena:", error);
//         }
//       }
//     };

//     loadToken();
//   }, []);

//   return (
//     <View style={styles.container}>
//       <View style={styles.topIllustration}>
//         <Text style={styles.title}>
//           Welcome {fristName} {lastName}!
//         </Text>
//         <Image
//           source={require("../assets//images/AdminPanelImage.png")}
//           style={styles.illustrationImage}
//         />

//         <Text style={styles.title}>What we gona do today?</Text>
//       </View>

//       <TouchableOpacity
//         style={styles.button}
//         onPress={handleMoveToPetListPanel}
//       >
//         <Text style={styles.buttonText}>Admin Panel</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }



import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import styles from "../assets/styles/main.styles";
import adminStyles from "../assets/styles/admin.styles";
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

  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await AsyncStorage.getItem("userToken");
      setToken(storedToken);

      if (storedToken) {
        try {
          const decoded = jwtDecode(storedToken);

          setFirstName(decoded.firstName);
          setLastName(decoded.lastName);
        } catch (error) {
          console.log("Token decoding error:", error);
        }
      }
    };

    loadToken();
  }, []);

  const menuItems = [
    { 
      title: "Pet Types", 
      icon: "paw", 
      route: "/pet-types",
      description: "Manage animal types" 
    },
    { 
      title: "Breeds", 
      icon: "list", 
      route: "/breeds",
      description: "Manage pet breeds" 
    },
    { 
      title: "Pets", 
      icon: "pets", 
      route: "/pets",
      description: "Manage pet listings" 
    },
    { 
      title: "Health Records", 
      icon: "medkit", 
      route: "/health-records",
      description: "Manage health records" 
    },
    { 
      title: "Adoption Requests", 
      icon: "heart", 
      route: "/adoption-requests",
      description: "Manage adoption applications" 
    },
    { 
      title: "Tags", 
      icon: "pricetag", 
      route: "/tags",
      description: "Manage pet tags" 
    },
    { 
      title: "Pet Tags", 
      icon: "bookmark", 
      route: "/pet-tags",
      description: "Manage pet tag assignments" 
    },
    { 
      title: "Users", 
      icon: "people", 
      route: "/users",
      description: "Manage user accounts" 
    },
  ];

  //TODO logi
  //nawigacja z walidacją tokena
  const handleNavigation = (route) => {
    if(!token){
      console.log('brak tokena, powrót do logowania');
      router.replace("/login");
      return;
    }

    console.log('nawigacja do: ', route);
    router.push(route);
  }

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
            onPress={() => handleNavigation(item.route)}
          >
            <Ionicons name={item.icon} size={32} color={COLORS.primary} />
            <Text style={styles.adminMenuItemTitle}>{item.title}</Text>
            <Text style={styles.adminMenuItemDescription}>{item.description}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: COLORS.secondary, marginTop: 20 }]}
        onPress={() => router.push("/")}
      >
        <Text style={styles.buttonText}>Back to Main Menu</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
