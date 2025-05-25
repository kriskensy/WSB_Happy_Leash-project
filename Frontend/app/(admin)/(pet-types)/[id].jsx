// import { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   ActivityIndicator,
//   Alert,
// } from "react-native";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Ionicons } from "@expo/vector-icons";
// import styles from "../../../assets/styles/main.styles";
// import adminStyles from "../../../assets/styles/admin.styles";
// import AdminHeader from "../(components)/AdminHeader";
// import COLORS from "../../../constants/colors";

// export default function PetTypeDetails() {
//   const { id } = useLocalSearchParams();
//   const [petType, setPetType] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     fetchPetType();
//   }, [id]);

//   const fetchPetType = async () => {
//     try {
//       setLoading(true);
//       const token = await AsyncStorage.getItem("userToken");
//       const response = await fetch(`http://10.0.2.2:5000/api/PetType/${id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setPetType(data);
//       } else {
//         Alert.alert("Error", "Failed to load pet type details");
//         router.back();
//       }
//     } catch (error) {
//       console.error("Error fetching pet type:", error);
//       Alert.alert("Error", "An unexpected error occurred");
//       router.back();
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async () => {
//     try {
//       setLoading(true);
//       const token = await AsyncStorage.getItem("userToken");
//       const response = await fetch(`http://10.0.2.2:5000/api/PetType/${id}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (response.ok) {
//         Alert.alert("Success", "Pet type deleted successfully", [
//           { text: "OK", onPress: () => router.push("/pet-types") },
//         ]);
//       } else {
//         Alert.alert("Error", "Failed to delete pet type");
//       }
//     } catch (error) {
//       console.error("Error deleting pet type:", error);
//       Alert.alert("Error", "An unexpected error occurred");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const confirmDelete = () => {
//     Alert.alert(
//       "Confirm Delete",
//       `Are you sure you want to delete "${petType?.name}"?`,
//       [
//         { text: "Cancel", style: "cancel" },
//         { text: "Delete", onPress: handleDelete, style: "destructive" },
//       ]
//     );
//   };

//   if (loading) {
//     return (
//       <View style={[styles.container, { justifyContent: "center" }]}>
//         <ActivityIndicator size="large" color={COLORS.primary} />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <AdminHeader title="Pet Type Details" />

//       <View style={styles.card}>
//         <Text style={styles.detailLabel}>ID:</Text>
//         <Text style={styles.detailValue}>{petType.id}</Text>

//         <Text style={styles.detailLabel}>Name:</Text>
//         <Text style={styles.detailValue}>{petType.name}</Text>
//       </View>

//       <View style={styles.buttonRow}>
//         <TouchableOpacity
//           style={[styles.button, { flex: 1, marginRight: 5 }]}
//           onPress={() => router.push(`/pet-types/edit/${id}`)}
//         >
//           <Text style={styles.buttonText}>Edit</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[
//             styles.button,
//             { flex: 1, marginLeft: 5, backgroundColor: COLORS.danger },
//           ]}
//           onPress={confirmDelete}
//         >
//           <Text style={styles.buttonText}>Delete</Text>
//         </TouchableOpacity>
//       </View>

//       <TouchableOpacity
//         style={[
//           styles.button,
//           { backgroundColor: COLORS.secondary, marginTop: 10 },
//         ]}
//         onPress={() => router.push("/pet-types")}
//       >
//         <Text style={styles.buttonText}>Back to List</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

import { useEffect, useState } from "react";
import {
  View,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  ScrollView,
  Text,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import adminStyles from "../../../assets/styles/admin.styles";
import AdminHeader from "../(components)/AdminHeader";
import COLORS from "../../../constants/colors";
import DetailRow from '../../../components/DetailRow';

export default function PetTypeDetails() {
  const { id } = useLocalSearchParams();
  const [petType, setPetType] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchPetType();
  }, [id]);

  const fetchPetType = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(`http://10.0.2.2:5000/api/PetType/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPetType(data);
      } else {
        Alert.alert("Error", "Failed to load pet type details");
        router.back();
      }
    } catch (error) {
      console.error("Error fetching pet type:", error);
      Alert.alert("Error", "An unexpected error occurred");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  if (loading || !petType) {
    return (
      <View style={[adminStyles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={adminStyles.container}>
      <AdminHeader title="Pet Type Details" />
      <View style={adminStyles.card}>
        <DetailRow label="ID" value={petType.id} />
        <DetailRow label="Name" value={petType.name} />
      </View>
      <TouchableOpacity
        style={[adminStyles.mainButton, { marginTop: 16 }]}
        onPress={() => router.push("/(admin)/(pet-types)")}
      >
        <Text style={adminStyles.mainButtonText}>Back to List</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
