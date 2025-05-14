import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../../../assets/styles/main.styles";
import COLORS from "../../../constants/colors";

export default function ListItem({ title, subtitle, onPress, iconName = "chevron-forward" }) {
  return (
    <TouchableOpacity 
      style={styles.listItem} 
      onPress={onPress}
    >
      <View style={styles.listItemContent}>
        <Text style={styles.listItemTitle}>{title}</Text>
        {subtitle && <Text style={styles.listItemSubtitle}>{subtitle}</Text>}
      </View>
      <Ionicons name={iconName} size={20} color={COLORS.primary} />
    </TouchableOpacity>
  );
}