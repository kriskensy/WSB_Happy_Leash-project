import { View, Text, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../../../assets/styles/main.styles";
import COLORS from "../../../constants/colors";

export default function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  iconName,
  secureTextEntry = false,
  keyboardType = "default",
}) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        {iconName && (
          <Ionicons
            name={iconName}
            size={20}
            color={COLORS.primary}
            style={styles.inputIcon}
          />
        )}
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
        />
      </View>
    </View>
  );
}