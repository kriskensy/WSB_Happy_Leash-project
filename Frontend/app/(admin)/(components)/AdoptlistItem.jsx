import { View, Text, TouchableOpacity } from "react-native";
import adminStyles from "../../../assets/styles/admin.styles";
import styles from "../../../assets/styles/main.styles";
import { Image } from "expo-image";

export default function AdoptListItem({ petName, image, onPress }) {
  return (
    <View style={styles.petContainer}>
      <TouchableOpacity
        style={styles.petContainer}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={petName}
      >
        <Image style={styles.petImage} source={{ uri: image }} />
        <Text style={styles.subtitle}>{petName}</Text>
      </TouchableOpacity>
    </View>
  );
}
