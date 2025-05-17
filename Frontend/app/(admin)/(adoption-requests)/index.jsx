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

// export default function AdoptionRequestList() {
//   const [adoptionRequests, setAdoptionRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     fetchAdoptionRequests();
//   }, []);

//   const fetchAdoptionRequests = async () => {
//     try {
//       setLoading(true);
//       const token = await AsyncStorage.getItem("userToken");
//       const response = await fetch("http://10.0.2.2:5000/api/AdoptionRequest", {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setAdoptionRequests(data);
//       } else {
//         Alert.alert("Error", "Failed to load adoption requests");
//       }
//     } catch (error) {
//       console.error("Error fetching adoption requests:", error);
//       Alert.alert("Error", "An unexpected error occurred");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteAdoptionRequest = async (id) => {
//     try {
//       const token = await AsyncStorage.getItem("userToken");
//       const response = await fetch(
//         `http://10.0.2.2:5000/api/AdoptionRequest/${id}`,
//         {
//           method: "DELETE",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (response.ok) {
//         Alert.alert("Success", "Adoption request deleted successfully");
//         fetchAdoptionRequests(); // Refresh the list
//       } else {
//         Alert.alert("Error", "Failed to delete adoption request");
//       }
//     } catch (error) {
//       console.error("Error deleting adoption request:", error);
//       Alert.alert("Error", "An unexpected error occurred");
//     }
//   };

//   const confirmDelete = (id, petName, userName) => {
//     Alert.alert(
//       "Confirm Delete",
//       `Are you sure you want to delete the adoption request for "${petName}" by "${userName}"?`,
//       [
//         { text: "Cancel", style: "cancel" },
//         {
//           text: "Delete",
//           onPress: () => handleDeleteAdoptionRequest(id),
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
//       <AdminHeader title="Adoption Requests" showBack={false} />

//       <TouchableOpacity
//         style={styles.button}
//         onPress={() => router.push("/adoption-requests/create")}
//       >
//         <Text style={styles.buttonText}>Add New Adoption Request</Text>
//       </TouchableOpacity>

//       <FlatList
//         data={adoptionRequests}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={({ item }) => (
//           <View style={styles.listItemWithActions}>
//             <ListItem
//               title={`${item.petName} - ${item.userName}`}
//               subtitle={`Status: ${
//                 item.isApproved ? "Approved" : "Pending"
//               } - ${formatDate(item.requestDate)}`}
//               onPress={() => router.push(`/adoption-requests/${item.id}`)}
//             />
//             <View style={styles.actionButtons}>
//               <TouchableOpacity
//                 style={styles.actionButton}
//                 onPress={() =>
//                   router.push(`/adoption-requests/edit/${item.id}`)
//                 }
//               >
//                 <Ionicons name="pencil" size={20} color={COLORS.primary} />
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.actionButton}
//                 onPress={() =>
//                   confirmDelete(item.id, item.petName, item.userName)
//                 }
//               >
//                 <Ionicons name="trash" size={20} color={COLORS.danger} />
//               </TouchableOpacity>
//             </View>
//           </View>
//         )}
//         ListEmptyComponent={
//           <Text style={styles.emptyListText}>No adoption requests found</Text>
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

export default function AdoptionRequestList() {
  const [adoptionRequests, setAdoptionRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchAdoptionRequests();
  }, []);

  const fetchAdoptionRequests = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch("http://10.0.2.2:5000/api/AdoptionRequest", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAdoptionRequests(data);
      } else {
        Alert.alert("Error", "Failed to load adoption requests");
      }
    } catch (error) {
      console.error("Error fetching adoption requests:", error);
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleRedirect = async () => {
    try {
      router.push("/(admin)/(adoption-requests)/create");
    } catch (error) {
      console.error("Error details:", error);
      Alert.alert("Error!", error.message || "Unknown error.");
    }
  };

  const handleRedirectToEdit = async (id) => {
    try {
      router.push(`/(admin)/(adoption-requests)/edit/${id}`);
    } catch (error) {
      console.error("Error details:", error);
      Alert.alert("Error!", error.message || "Unknown error.");
    }
  };
  const handleDeleteAdoptionRequest = async (id) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(
        `http://10.0.2.2:5000/api/AdoptionRequest/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        Alert.alert("Success", "Adoption request deleted successfully");
        fetchAdoptionRequests();
      } else {
        Alert.alert("Error", "Failed to delete adoption request");
      }
    } catch (error) {
      console.error("Error deleting adoption request:", error);
      Alert.alert("Error", "An unexpected error occurred");
    }
  };

  const confirmDelete = (id, petName, userName) => {
    Alert.alert(
      "Confirm Delete",
      `Are you sure you want to delete the adoption request for "${petName}" by "${userName}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: () => handleDeleteAdoptionRequest(id),
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
      <AdminHeader title="Adoption Requests" showBack={false} />

      <TouchableOpacity
        style={adminStyles.mainButton}
        onPress={() => handleRedirect()}
        accessibilityLabel="Add new adoption request"
        accessibilityRole="button"
      >
        <Text style={adminStyles.mainButtonText}>Add New Adoption Request</Text>
      </TouchableOpacity>

      <FlatList
        data={adoptionRequests}
        keyExtractor={(item) => item.id.toString()}
        style={adminStyles.list}
        renderItem={({ item }) => (
          <View style={adminStyles.listItemWithActions}>
            <ListItem
              title={`${item.petName} - ${item.userName}`}
              subtitle={`Status: ${
                item.isApproved ? "Approved" : "Pending"
              } - ${formatDate(item.requestDate)}`}
              onPress={() => router.push(`/adoption-requests/${item.id}`)}
            />
            <View style={adminStyles.actionButtons}>
              <TouchableOpacity
                style={adminStyles.actionButton}
                onPress={() => handleRedirectToEdit(item.id)}
                accessibilityLabel={`Edit request for ${item.petName}`}
                accessibilityRole="button"
              >
                <Ionicons name="pencil" size={20} color={COLORS.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={adminStyles.actionButton}
                onPress={() =>
                  confirmDelete(item.id, item.petName, item.userName)
                }
                accessibilityLabel={`Delete request for ${item.petName}`}
                accessibilityRole="button"
              >
                <Ionicons name="trash" size={20} color={COLORS.danger} />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={adminStyles.emptyListText}>
            No adoption requests found
          </Text>
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
