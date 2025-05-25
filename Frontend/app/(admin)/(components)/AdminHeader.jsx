import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import styles from "../../../assets/styles/main.styles";
import adminStyles from "../../../assets/styles/admin.styles";
import COLORS from "../../../constants/colors";

export default function AdminHeader({ title, showBack = true }) {
  const router = useRouter();
  
  return (
    <View style={adminStyles.adminHeader}>
      {showBack && (
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={adminStyles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      )}
      <Text style={adminStyles.adminHeaderTitle}>{title}</Text>
    </View>
  );
}