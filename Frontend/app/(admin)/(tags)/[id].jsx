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

// export default function TagDetails() {
//   const { id } = useLocalSearchParams();
//   const [tag, setTag] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     fetchTag();
//   }, [id]);

//   const fetchTag = async () => {
//     try {
//       setLoading(true);
//       const token = await AsyncStorage.getItem("userToken");
//       const response = await fetch(`http://10.0.2.2:5000/api/Tag/${id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setTag(data);
//       } else {
//         Alert.alert("Error", "Failed to load tag details");
//         router.back();
//       }
//     } catch (error) {
//       console.error("Error fetching tag:", error);
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
//       const response = await fetch(`http://10.0.2.2:5000/api/Tag/${id}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (response.ok) {
//         Alert.alert("Success", "Tag deleted successfully", [
//           { text: "OK", onPress: () => router.push("/tags") },
//         ]);
//       } else {
//         Alert.alert("Error", "Failed to delete tag");
//       }
//     } catch (error) {
//       console.error("Error deleting tag:", error);
//       Alert.alert("Error", "An unexpected error occurred");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const confirmDelete = () => {
//     Alert.alert("Confirm Delete", "Are you sure you want to delete this tag?", [
//       { text: "Cancel", style: "cancel" },
//       { text: "Delete", onPress: handleDelete, style: "destructive" },
//     ]);
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString() + " " + date.toLocaleTimeString();
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
//         <AdminHeader title="Tag Details" />

//         <View style={styles.card}>
//           <Text style={styles.detailLabel}>ID:</Text>
//           <Text style={styles.detailValue}>{tag.id}</Text>

//           <Text style={styles.detailLabel}>Name:</Text>
//           <Text style={styles.detailValue}>{tag.name}</Text>

//           <Text style={styles.detailLabel}>Created Date:</Text>
//           <Text style={styles.detailValue}>{formatDate(tag.createdDate)}</Text>
//         </View>

//         <View style={styles.buttonRow}>
//           <TouchableOpacity
//             style={[styles.button, { flex: 1, marginRight: 5 }]}
//             onPress={() => router.push(`/tags/edit/${id}`)}
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
//           onPress={() => router.push("/tags")}
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
  TouchableOpacity,
  ScrollView,
  Text,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import adminStyles from "../../../assets/styles/admin.styles";
import AdminHeader from "../(components)/AdminHeader";
import COLORS from "../../../constants/colors";
import { formatDate } from "../../../utils/dateUtils";
import DetailRow from '../../../components/DetailRow';

export default function TagDetails() {
  const { id } = useLocalSearchParams();
  const [tag, setTag] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchTag();
  }, [id]);

  const fetchTag = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(`http://10.0.2.2:5000/api/Tag/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTag(data);
      } else {
        Alert.alert("Error", "Failed to load tag details");
        router.back();
      }
    } catch (error) {
      console.error("Error fetching tag:", error);
      Alert.alert("Error", "An unexpected error occurred");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  if (loading || !tag) {
    return (
      <View style={[adminStyles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={adminStyles.container}>
      <AdminHeader title="Tag Details" />
      <View style={adminStyles.card}>
        <DetailRow label="ID" value={tag.id} />
        <DetailRow label="Name" value={tag.name} />
      </View>
      <TouchableOpacity
        style={[adminStyles.mainButton, { marginTop: 16 }]}
        onPress={() => router.push("/(admin)/(tags)")}
      >
        <Text style={adminStyles.mainButtonText}>Back to List</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
