// import { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   ActivityIndicator,
//   Alert,
//   ScrollView,
// } from "react-native";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import styles from "../../../assets/styles/main.styles";
// import adminStyles from "../../../assets/styles/admin.styles";
// import AdminHeader from "../(components)/AdminHeader";
// import COLORS from "../../../constants/colors";

// export default function BreedDetails() {
//   const { id } = useLocalSearchParams();
//   const [breed, setBreed] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     fetchBreed();
//   }, [id]);

//   const fetchBreed = async () => {
//     try {
//       setLoading(true);
//       const token = await AsyncStorage.getItem("userToken");
//       const response = await fetch(`http://10.0.2.2:5000/api/Breed/${id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setBreed(data);
//       } else {
//         Alert.alert("Error", "Failed to load breed details");
//         router.back();
//       }
//     } catch (error) {
//       console.error("Error fetching breed:", error);
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
//       const response = await fetch(`http://10.0.2.2:5000/api/Breed/${id}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (response.ok) {
//         Alert.alert("Success", "Breed deleted successfully", [
//           { text: "OK", onPress: () => router.push("/breeds") },
//         ]);
//       } else {
//         Alert.alert("Error", "Failed to delete breed");
//       }
//     } catch (error) {
//       console.error("Error deleting breed:", error);
//       Alert.alert("Error", "An unexpected error occurred");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const confirmDelete = () => {
//     Alert.alert(
//       "Confirm Delete",
//       `Are you sure you want to delete "${breed?.name}"?`,
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
//     <ScrollView style={styles.scrollContainer}>
//       <View style={styles.container}>
//         <AdminHeader title="Breed Details" />

//         <View style={styles.card}>
//           <Text style={styles.detailLabel}>ID:</Text>
//           <Text style={styles.detailValue}>{breed.id}</Text>

//           <Text style={styles.detailLabel}>Name:</Text>
//           <Text style={styles.detailValue}>{breed.name}</Text>

//           <Text style={styles.detailLabel}>Pet Type:</Text>
//           <Text style={styles.detailValue}>{breed.petTypeName}</Text>

//           <Text style={styles.detailLabel}>Description:</Text>
//           <Text style={styles.detailValue}>
//             {breed.description || "No description provided"}
//           </Text>
//         </View>

//         <View style={styles.buttonRow}>
//           <TouchableOpacity
//             style={[styles.button, { flex: 1, marginRight: 5 }]}
//             onPress={() => router.push(`/breeds/edit/${id}`)}
//           >
//             <Text style={styles.buttonText}>Edit</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={[
//               styles.button,
//               { flex: 1, marginLeft: 5, backgroundColor: COLORS.danger },
//             ]}
//             onPress={confirmDelete}
//           >
//             <Text style={styles.buttonText}>Delete</Text>
//           </TouchableOpacity>
//         </View>

//         <TouchableOpacity
//           style={[
//             styles.button,
//             { backgroundColor: COLORS.secondary, marginTop: 10 },
//           ]}
//           onPress={() => router.push("/breeds")}
//         >
//           <Text style={styles.buttonText}>Back to List</Text>
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// }

import { useEffect, useState } from "react";
import {
  View,
  ActivityIndicator,
  Alert,
  ScrollView,
  TouchableOpacity,
  Text,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import adminStyles from "../../../assets/styles/admin.styles";
import AdminHeader from "../(components)/AdminHeader";
import COLORS from "../../../constants/colors";
import DetailRow from '../../../components/DetailRow';
import PetTypeDetails from "../(pet-types)/[id]";

export default function BreedDetails() {
  const { id } = useLocalSearchParams();
  const [breed, setBreed] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchBreed();
  }, [id]);

  const fetchBreed = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(`http://10.0.2.2:5000/api/Breed/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBreed(data);
      } else {
        Alert.alert("Error", "Failed to load breed details");
        router.back();
      }
    } catch (error) {
      console.error("Error fetching breed:", error);
      Alert.alert("Error", "An unexpected error occurred");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[adminStyles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!breed) {
    return null;
  }

  return (
    <ScrollView style={adminStyles.container}>
      <AdminHeader title="Breed Details" />
      <View style={adminStyles.card}>
        <DetailRow label="ID" value={breed.id} />
        <DetailRow label="Name" value={breed.name} />
        <DetailRow label="Pet Type" value={breed.petTypeName|| "-"} />
      </View>
      <TouchableOpacity
        style={[adminStyles.mainButton, { marginTop: 16 }]}
        onPress={() => router.push("/(admin)/(breeds)")}
      >
        <Text style={adminStyles.mainButtonText}>Back to List</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
