// import { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   FlatList,
//   ActivityIndicator,
//   Alert,
// } from "react-native";
// import { useRouter } from "expo-router";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Ionicons } from "@expo/vector-icons";
// import styles from "../../../assets/styles/main.styles";
// import AdminHeader from "../(components)/AdminHeader";
// import ListItem from "../(components)/ListItem";
// import COLORS from "../../../constants/colors";

// export default function HealthRecordList() {
//   const [healthRecords, setHealthRecords] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     fetchHealthRecords();
//   }, []);

//   const fetchHealthRecords = async () => {
//     try {
//       setLoading(true);
//       const token = await AsyncStorage.getItem("userToken");
//       const response = await fetch("http://10.0.2.2:5000/api/HealthRecord", {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setHealthRecords(data);
//       } else {
//         Alert.alert("Error", "Failed to load health records");
//       }
//     } catch (error) {
//       console.error("Error fetching health records:", error);
//       Alert.alert("Error", "An unexpected error occurred");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteHealthRecord = async (id) => {
//     try {
//       const token = await AsyncStorage.getItem("userToken");
//       const response = await fetch(
//         `http://10.0.2.2:5000/api/HealthRecord/${id}`,
//         {
//           method: "DELETE",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (response.ok) {
//         Alert.alert("Success", "Health record deleted successfully");
//         fetchHealthRecords();
//       } else {
//         Alert.alert("Error", "Failed to delete health record");
//       }
//     } catch (error) {
//       console.error("Error deleting health record:", error);
//       Alert.alert("Error", "An unexpected error occurred");
//     }
//   };

//   const confirmDelete = (id, petName) => {
//     Alert.alert(
//       "Confirm Delete",
//       `Are you sure you want to delete health record for "${petName}"?`,
//       [
//         { text: "Cancel", style: "cancel" },
//         {
//           text: "Delete",
//           onPress: () => handleDeleteHealthRecord(id),
//           style: "destructive",
//         },
//       ]
//     );
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString();
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
//       <AdminHeader title="Health Records" showBack={false} />

//       <TouchableOpacity
//         style={styles.button}
//         onPress={() => router.push("/health-records/create")}
//       >
//         <Text style={styles.buttonText}>Add New Health Record</Text>
//       </TouchableOpacity>

//       <FlatList
//         data={healthRecords}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={({ item }) => (
//           <View style={styles.listItemWithActions}>
//             <ListItem
//               title={`${item.petName} - ${item.vetName}`}
//               subtitle={`${formatDate(item.recordDate)} - Vaccination: ${
//                 item.vaccinationStatus
//               }`}
//               onPress={() => router.push(`/health-records/${item.id}`)}
//             />
//             <View style={styles.actionButtons}>
//               <TouchableOpacity
//                 style={styles.actionButton}
//                 onPress={() => router.push(`/health-records/edit/${item.id}`)}
//               >
//                 <Ionicons name="pencil" size={20} color={COLORS.primary} />
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.actionButton}
//                 onPress={() => confirmDelete(item.id, item.petName)}
//               >
//                 <Ionicons name="trash" size={20} color={COLORS.danger} />
//               </TouchableOpacity>
//             </View>
//           </View>
//         )}
//         ListEmptyComponent={
//           <Text style={styles.emptyListText}>No health records found</Text>
//         }
//       />

//       <TouchableOpacity
//         style={[styles.button, { backgroundColor: COLORS.primary }]}
//         onPress={() => router.push("/admin-menu")}
//       >
//         <Text style={styles.buttonText}>Back to Admin Menu</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }


import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import adminStyles from "../../../assets/styles/admin.styles";
import AdminHeader from "../(components)/AdminHeader";
import ListItem from "../(components)/ListItem";
import COLORS from "../../../constants/colors";

export default function HealthRecordList() {
  const [healthRecords, setHealthRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchHealthRecords();
  }, []);

  const fetchHealthRecords = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch("http://10.0.2.2:5000/api/HealthRecord", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setHealthRecords(data);
      } else {
        Alert.alert("Error", "Failed to load health records");
      }
    } catch (error) {
      console.error("Error fetching health records:", error);
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHealthRecord = async (id) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(
        `http://10.0.2.2:5000/api/HealthRecord/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        Alert.alert("Success", "Health record deleted successfully");
        fetchHealthRecords();
      } else {
        Alert.alert("Error", "Failed to delete health record");
      }
    } catch (error) {
      console.error("Error deleting health record:", error);
      Alert.alert("Error", "An unexpected error occurred");
    }
  };

  const confirmDelete = (id, petName) => {
    Alert.alert(
      "Confirm Delete",
      `Are you sure you want to delete health record for "${petName}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: () => handleDeleteHealthRecord(id),
          style: "destructive",
        },
      ]
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <View style={adminStyles.loaderContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={adminStyles.container}>
      <AdminHeader title="Health Records" showBack={false} />

      <TouchableOpacity
        style={adminStyles.mainButton}
        onPress={() => router.push("/health-records/create")}
        accessibilityLabel="Add new health record"
        accessibilityRole="button"
      >
        <Text style={adminStyles.mainButtonText}>Add New Health Record</Text>
      </TouchableOpacity>

      <FlatList
        data={healthRecords}
        keyExtractor={(item) => item.id.toString()}
        style={adminStyles.list}
        renderItem={({ item }) => (
          <View style={adminStyles.listItemWithActions}>
            <ListItem
              title={`${item.petName} - ${item.vetName}`}
              subtitle={`${formatDate(item.recordDate)} - Vaccination: ${
                item.vaccinationStatus
              }`}
              onPress={() => router.push(`/health-records/${item.id}`)}
            />
            <View style={adminStyles.actionButtons}>
              <TouchableOpacity
                style={adminStyles.actionButton}
                onPress={() => router.push(`/health-records/edit/${item.id}`)}
                accessibilityLabel={`Edit health record for ${item.petName}`}
                accessibilityRole="button"
              >
                <Ionicons name="pencil" size={20} color={COLORS.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={adminStyles.actionButton}
                onPress={() => confirmDelete(item.id, item.petName)}
                accessibilityLabel={`Delete health record for ${item.petName}`}
                accessibilityRole="button"
              >
                <Ionicons name="trash" size={20} color={COLORS.danger} />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={adminStyles.emptyListText}>No health records found</Text>
        }
      />

      <TouchableOpacity
        style={adminStyles.mainButton}
        onPress={() => router.push("../adminMenu")}
        accessibilityLabel="Back to admin menu"
        accessibilityRole="button"
      >
        <Text style={adminStyles.mainButtonText}>Back to Admin Menu</Text>
      </TouchableOpacity>
    </View>
  );
}
