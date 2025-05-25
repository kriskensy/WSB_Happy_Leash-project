// import { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   ActivityIndicator,
//   Alert,
//   ScrollView,
//   Image,
// } from "react-native";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import styles from "../../../assets/styles/main.styles";
// import adminStyles from "../../../assets/styles/admin.styles";
// import AdminHeader from "../(components)/AdminHeader";
// import COLORS from "../../../constants/colors";

// export default function UserDetails() {
//   const { id } = useLocalSearchParams();
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     fetchUser();
//   }, [id]);

//   const fetchUser = async () => {
//     try {
//       setLoading(true);
//       const token = await AsyncStorage.getItem("userToken");
//       const response = await fetch(`http://10.0.2.2:5000/api/User/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (response.ok) setUser(await response.json());
//       else {
//         Alert.alert("Error", "Failed to load user details");
//         router.back();
//       }
//     } catch {
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
//       const response = await fetch(`http://10.0.2.2:5000/api/User/${id}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (response.ok) {
//         Alert.alert("Success", "User deleted", [
//           { text: "OK", onPress: () => router.push("/users") },
//         ]);
//       } else {
//         Alert.alert("Error", "Failed to delete user");
//       }
//     } catch {
//       Alert.alert("Error", "An unexpected error occurred");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const confirmDelete = () => {
//     Alert.alert(
//       "Confirm Delete",
//       `Delete user "${user?.firstName} ${user?.lastName}"?`,
//       [
//         { text: "Cancel", style: "cancel" },
//         { text: "Delete", onPress: handleDelete, style: "destructive" },
//       ]
//     );
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString() + " " + date.toLocaleTimeString();
//   };

//   if (loading || !user) {
//     return (
//       <View style={[styles.container, { justifyContent: "center" }]}>
//         <ActivityIndicator size="large" color={COLORS.primary} />
//       </View>
//     );
//   }

//   return (
//     <ScrollView style={styles.scrollContainer}>
//       <View style={styles.container}>
//         <AdminHeader title="User Details" />
//         {user.profilePictureURL ? (
//           <Image
//             source={{ uri: user.profilePictureURL }}
//             style={{
//               width: 120,
//               height: 120,
//               borderRadius: 60,
//               marginBottom: 10,
//             }}
//           />
//         ) : null}
//         <View style={styles.card}>
//           <Text style={styles.detailLabel}>First Name:</Text>
//           <Text style={styles.detailValue}>{user.firstName}</Text>
//           <Text style={styles.detailLabel}>Last Name:</Text>
//           <Text style={styles.detailValue}>{user.lastName}</Text>
//           <Text style={styles.detailLabel}>Email:</Text>
//           <Text style={styles.detailValue}>{user.email}</Text>
//           <Text style={styles.detailLabel}>Login:</Text>
//           <Text style={styles.detailValue}>{user.login}</Text>
//           <Text style={styles.detailLabel}>User Type:</Text>
//           <Text style={styles.detailValue}>{user.userType}</Text>
//           <Text style={styles.detailLabel}>Created At:</Text>
//           <Text style={styles.detailValue}>{formatDate(user.createdAt)}</Text>
//           <Text style={styles.detailLabel}>Address:</Text>
//           <Text style={styles.detailValue}>{user.address || "-"}</Text>
//           <Text style={styles.detailLabel}>City:</Text>
//           <Text style={styles.detailValue}>{user.city || "-"}</Text>
//           <Text style={styles.detailLabel}>Country:</Text>
//           <Text style={styles.detailValue}>{user.country || "-"}</Text>
//           <Text style={styles.detailLabel}>Phone Number:</Text>
//           <Text style={styles.detailValue}>{user.phoneNumber || "-"}</Text>
//           <Text style={styles.detailLabel}>Postal Code:</Text>
//           <Text style={styles.detailValue}>{user.postalCode || "-"}</Text>
//         </View>
//         <View style={styles.buttonRow}>
//           <TouchableOpacity
//             style={[styles.button, { flex: 1, marginRight: 5 }]}
//             onPress={() => router.push(`/users/edit/${id}`)}
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
//           onPress={() => router.push("/users")}
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
  Image,
  Text,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import adminStyles from "../../../assets/styles/admin.styles";
import AdminHeader from "../(components)/AdminHeader";
import COLORS from "../../../constants/colors";
import { formatDate } from "../../../utils/dateUtils";
import DetailRow from '../../../components/DetailRow';

export default function UserDetails() {
  const { id } = useLocalSearchParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(`http://10.0.2.2:5000/api/User/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) setUser(await response.json());
      else {
        Alert.alert("Error", "Failed to load user details");
        router.back();
      }
    } catch {
      Alert.alert("Error", "An unexpected error occurred");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  if (loading || !user) {
    return (
      <View style={[adminStyles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={adminStyles.container}>
      <AdminHeader title="User Details" />
      {user.profilePictureURL ? (
        <Image
          source={{ uri: user.profilePictureURL }}
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            marginBottom: 10,
            alignSelf: "center",
          }}
        />
      ) : null}
      <View style={adminStyles.card}>
        <DetailRow label="First Name" value={user.firstName} />
        <DetailRow label="Last Name" value={user.lastName} />
        <DetailRow label="Email" value={user.email} />
        <DetailRow label="Login" value={user.login} />
        <DetailRow label="User Type" value={user.userType} />
        <DetailRow label="Created At" value={formatDate(user.createdAt)} />
        <DetailRow label="Address" value={user.address || "-"} />
        <DetailRow label="City" value={user.city || "-"} />
        <DetailRow label="Country" value={user.country || "-"} />
        <DetailRow label="Phone Number" value={user.phoneNumber || "-"} />
        <DetailRow label="Postal Code" value={user.postalCode || "-"} />
      </View>
      <TouchableOpacity
        style={[adminStyles.mainButton, { marginTop: 16 }]}
        onPress={() => router.push("/(admin)/(users)")}
      >
        <Text style={adminStyles.mainButtonText}>Back to List</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}