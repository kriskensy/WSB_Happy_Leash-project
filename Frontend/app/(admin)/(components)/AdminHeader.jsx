import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import styles from "../../../assets/styles/main.styles";
import COLORS from "../../../constants/colors";

export default function AdminHeader({ title, showBack = true }) {
  const router = useRouter();
  
  return (
    <View style={styles.adminHeader}>
      {showBack && (
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      )}
      <Text style={styles.adminHeaderTitle}>{title}</Text>
    </View>
  );
}